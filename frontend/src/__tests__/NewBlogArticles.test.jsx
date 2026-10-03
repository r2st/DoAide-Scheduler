import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));

describe("AiSchedulingSaves", () => {
  it("renders the article title", async () => {
    const { default: C } = await import("../pages/blog/AiSchedulingSaves");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How AI Scheduling Saves 10+ Hours Per Week");
  });

  it("contains link to meeting cost calculator", async () => {
    const { default: C } = await import("../pages/blog/AiSchedulingSaves");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByText("Meeting Cost Calculator")).toBeInTheDocument();
  });
});

describe("AutomatedBookingGuide", () => {
  it("renders the article title", async () => {
    const { default: C } = await import("../pages/blog/AutomatedBookingGuide");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("The Complete Guide to Automated Appointment Booking");
  });

  it("contains link to availability finder", async () => {
    const { default: C } = await import("../pages/blog/AutomatedBookingGuide");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByText("Availability Finder")).toBeInTheDocument();
  });
});

describe("SmartSchedulingBoosts", () => {
  it("renders the article title", async () => {
    const { default: C } = await import("../pages/blog/SmartSchedulingBoosts");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("5 Ways Smart Scheduling Boosts Customer Satisfaction");
  });

  it("contains link to timezone converter", async () => {
    const { default: C } = await import("../pages/blog/SmartSchedulingBoosts");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByText("Timezone Converter")).toBeInTheDocument();
  });
});
