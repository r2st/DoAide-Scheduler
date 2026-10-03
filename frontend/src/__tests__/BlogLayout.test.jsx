import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));

import BlogLayout, { BlogIndex, ARTICLES } from "../pages/BlogLayout";

describe("BlogIndex", () => {
  it("renders all article cards", () => {
    render(
      <MemoryRouter>
        <BlogIndex />
      </MemoryRouter>
    );
    ARTICLES.forEach((a) => {
      expect(screen.getByText(a.title)).toBeInTheDocument();
    });
  });
});

describe("BlogLayout", () => {
  it("renders blog header", () => {
    render(
      <MemoryRouter>
        <BlogLayout />
      </MemoryRouter>
    );
    expect(screen.getByText("DoAide Scheduler Blog")).toBeInTheDocument();
  });
});

describe("Blog articles", () => {
  it("MeetingProductivity renders", async () => {
    const { default: C } = await import("../pages/blog/MeetingProductivity");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("RemoteScheduling renders", async () => {
    const { default: C } = await import("../pages/blog/RemoteScheduling");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("CalendarManagement renders", async () => {
    const { default: C } = await import("../pages/blog/CalendarManagement");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
