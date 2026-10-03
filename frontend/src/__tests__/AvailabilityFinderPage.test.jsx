import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));
vi.mock("../lib/track", () => ({ track: vi.fn() }));
vi.mock("../lib/share", () => ({
  fullUrl: vi.fn(() => "https://scheduler.doaide.com/tools/availability-finder"),
  whatsappUrl: vi.fn(() => "https://wa.me/"),
  twitterUrl: vi.fn(() => "https://twitter.com/intent/tweet"),
  copyToClipboard: vi.fn(),
}));

import AvailabilityFinderPage from "../pages/AvailabilityFinderPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <AvailabilityFinderPage />
    </MemoryRouter>
  );
}

describe("AvailabilityFinderPage", () => {
  it("renders the page title", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Availability Finder" })).toBeInTheDocument();
  });

  it("renders two default participants", () => {
    renderPage();
    expect(screen.getByDisplayValue("Person 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Person 2")).toBeInTheDocument();
  });

  it("shows overlapping slots section", () => {
    renderPage();
    expect(screen.getByText("Overlapping Slots")).toBeInTheDocument();
  });

  it("shows overlap results for default 9-5 schedules", () => {
    renderPage();
    expect(screen.getByText("Total Overlap")).toBeInTheDocument();
    expect(screen.getByText("40 hours/week")).toBeInTheDocument();
  });

  it("adds a participant when clicking Add", () => {
    renderPage();
    const input = screen.getByPlaceholderText("Add participant name");
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
  });

  it("removes a participant when clicking Remove", () => {
    renderPage();
    fireEvent.click(screen.getByText("Add"));
    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);
    expect(screen.queryByDisplayValue("Person 1")).not.toBeInTheDocument();
  });

  it("renders share buttons", () => {
    renderPage();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
  });

  it("renders SEO info section", () => {
    renderPage();
    expect(screen.getByText("Why Availability Matching Matters")).toBeInTheDocument();
  });
});
