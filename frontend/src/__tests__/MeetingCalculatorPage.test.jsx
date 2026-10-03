import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));
vi.mock("../lib/track", () => ({ track: vi.fn() }));
vi.mock("../lib/share", () => ({
  fullUrl: vi.fn(() => "https://scheduler.doaide.com/calculator"),
  whatsappUrl: vi.fn(() => "https://wa.me/"),
  twitterUrl: vi.fn(() => "https://twitter.com/intent/tweet"),
  copyToClipboard: vi.fn(),
}));

import MeetingCalculatorPage from "../pages/MeetingCalculatorPage";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/calculator"]}>
      <MeetingCalculatorPage />
    </MemoryRouter>
  );
}

describe("MeetingCalculatorPage", () => {
  it("renders the page title", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Meeting Cost Calculator" })).toBeInTheDocument();
  });

  it("shows cost breakdown", () => {
    renderPage();
    expect(screen.getByText("Cost per Meeting")).toBeInTheDocument();
    expect(screen.getByText("Annual Meeting Cost")).toBeInTheDocument();
  });

  it("updates when inputs change", () => {
    renderPage();
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "10" } });
    expect(screen.getByText("Annual Meeting Cost")).toBeInTheDocument();
  });
});
