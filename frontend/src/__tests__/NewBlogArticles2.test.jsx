import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));

describe("EffectiveOneOnOnes", () => {
  it("renders the article title", async () => {
    const { default: C } = await import("../pages/blog/EffectiveOneOnOnes");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How to Run Effective One-on-One Meetings");
  });

  it("contains link to meeting planner", async () => {
    const { default: C } = await import("../pages/blog/EffectiveOneOnOnes");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByText("AI Meeting Planner")).toBeInTheDocument();
  });
});

describe("AiCalendarTools2026", () => {
  it("renders the article title", async () => {
    const { default: C } = await import("../pages/blog/AiCalendarTools2026");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Rise of AI Calendar Tools in 2026");
  });

  it("contains link to weekly planner", async () => {
    const { default: C } = await import("../pages/blog/AiCalendarTools2026");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByText("Weekly Planner")).toBeInTheDocument();
  });
});

describe("WeeklyPlanningFramework", () => {
  it("renders the article title", async () => {
    const { default: C } = await import("../pages/blog/WeeklyPlanningFramework");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Weekly Planning: A Framework for Productive Weeks");
  });

  it("contains link to weekly planner tool", async () => {
    const { default: C } = await import("../pages/blog/WeeklyPlanningFramework");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getAllByText("Weekly Planner").length).toBeGreaterThan(0);
  });
});
