import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));
vi.mock("../lib/track", () => ({ track: vi.fn() }));
vi.mock("../lib/share", () => ({
  fullUrl: vi.fn(() => "https://scheduler.doaide.com/tools/weekly-planner"),
  whatsappUrl: vi.fn(() => "https://wa.me/"),
  twitterUrl: vi.fn(() => "https://twitter.com/intent/tweet"),
  copyToClipboard: vi.fn(() => Promise.resolve(true)),
}));

import WeeklyPlannerPage from "../pages/WeeklyPlannerPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <WeeklyPlannerPage />
    </MemoryRouter>
  );
}

describe("WeeklyPlannerPage", () => {
  it("renders the page title", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Weekly Planner" })).toBeInTheDocument();
  });

  it("renders day columns", () => {
    renderPage();
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Friday")).toBeInTheDocument();
  });

  it("renders time slots", () => {
    renderPage();
    expect(screen.getByText("8 AM")).toBeInTheDocument();
    expect(screen.getByText("5 PM")).toBeInTheDocument();
  });

  it("renders category legend", () => {
    renderPage();
    expect(screen.getAllByText("Deep Work").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Meetings").length).toBeGreaterThan(0);
  });

  it("renders clear and export buttons", () => {
    renderPage();
    expect(screen.getByText("Copy as Text")).toBeInTheDocument();
    expect(screen.getByText("Clear All")).toBeInTheDocument();
  });

  it("renders task input fields", () => {
    renderPage();
    const inputs = screen.getAllByPlaceholderText("Add task");
    expect(inputs.length).toBe(50);
  });

  it("renders SEO info section", () => {
    renderPage();
    expect(screen.getByText("Why Time-Blocking Works")).toBeInTheDocument();
  });
});
