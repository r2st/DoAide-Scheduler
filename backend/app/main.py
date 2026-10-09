from __future__ import annotations

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

import app.models  # noqa: F401
from app.core.config import settings
from app.core.database import check_database, engine
from app.routers import auth, availability, bookings, calendar, health, meeting_types, notifications, public, team, tools

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    logging.basicConfig(level=getattr(logging, settings.log_level.upper(), logging.INFO))
    logger.info("Starting %s v%s", settings.app_name, settings.app_version)

    db_ok, db_error = check_database()
    if db_ok:
        logger.info("Database reachable")
    else:
        logger.error("Database unreachable at startup: %s", db_error)

    yield

    logger.info("Shutting down %s", settings.app_name)
    try:
        engine.dispose()
    except Exception as exc:
        logger.warning("Database pool did not dispose cleanly: %s", exc)
    logger.info("Shutdown complete")


def create_app() -> FastAPI:
    docs_url = "/docs" if settings.docs_enabled else None
    redoc_url = "/redoc" if settings.docs_enabled else None

    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        summary="AI meeting scheduler for businesses.",
        debug=settings.debug,
        lifespan=lifespan,
        docs_url=docs_url,
        redoc_url=redoc_url,
        contact={"name": "DoAide Scheduler", "url": "https://scheduler.doaide.com"},
        license_info={"name": "Proprietary"},
    )

    application.add_middleware(GZipMiddleware, minimum_size=1024)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
        expose_headers=["X-Request-ID", "Content-Disposition"],
        max_age=600,
    )

    prefix = settings.api_v1_prefix
    application.include_router(health.router, prefix=prefix)
    application.include_router(auth.router, prefix=prefix)
    application.include_router(meeting_types.router, prefix=prefix)
    application.include_router(bookings.router, prefix=prefix)
    application.include_router(availability.router, prefix=prefix)
    application.include_router(calendar.router, prefix=prefix)
    application.include_router(public.router, prefix=prefix)
    application.include_router(team.router, prefix=prefix)
    application.include_router(notifications.router, prefix=prefix)
    application.include_router(tools.router, prefix=prefix)

    @application.get("/", include_in_schema=False)
    def root() -> dict:
        return {
            "app": settings.app_name,
            "version": settings.app_version,
            "docs": docs_url,
            "health": f"{prefix}/health",
        }

    return application


app = create_app()
