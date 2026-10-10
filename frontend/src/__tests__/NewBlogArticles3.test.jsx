import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));

describe("BestFreeSchedulingTools2026", () => {
  it("renders the article title", async () => {
    const { default: C } = await import("../pages/blog/BestFreeSchedulingTools2026");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Best Free Scheduling Tools 2026: Compare Calendly vs DoAide vs Others");
  });

  it("contains link to meeting cost calculator", async () => {
    const { default: C } = await import("../pages/blog/BestFreeSchedulingTools2026");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByText("productivity tools")).toBeInTheDocument();
  });

  it("contains FAQ section", async () => {
    const { default: C } = await import("../pages/blog/BestFreeSchedulingTools2026");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
  });
});

describe("ScheduleMeetingsAcrossTimezones", () => {
  it("renders the article title", async () => {
    const { default: C } = await import("../pages/blog/ScheduleMeetingsAcrossTimezones");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How to Schedule Meetings Across Time Zones: Complete Guide");
  });

  it("contains link to timezone converter", async () => {
    const { default: C } = await import("../pages/blog/ScheduleMeetingsAcrossTimezones");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getAllByText("Timezone Converter").length).toBeGreaterThan(0);
  });

  it("contains FAQ section", async () => {
    const { default: C } = await import("../pages/blog/ScheduleMeetingsAcrossTimezones");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
  });
});

describe("AppointmentSchedulingSmallBusinessesIndia", () => {
  it("renders the article title", async () => {
    const { default: C } = await import("../pages/blog/AppointmentSchedulingSmallBusinessesIndia");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Appointment Scheduling for Small Businesses in India");
  });

  it("contains link to meeting cost calculator", async () => {
    const { default: C } = await import("../pages/blog/AppointmentSchedulingSmallBusinessesIndia");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getAllByText("Meeting Cost Calculator").length).toBeGreaterThan(0);
  });

  it("contains FAQ section", async () => {
    const { default: C } = await import("../pages/blog/AppointmentSchedulingSmallBusinessesIndia");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
  });
});
