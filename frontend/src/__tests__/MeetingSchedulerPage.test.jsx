import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));
vi.mock("../lib/track", () => ({ track: vi.fn() }));
vi.mock("../lib/share", () => ({
  fullUrl: vi.fn(() => "https://scheduler.doaide.com/tools/meeting-planner"),
  whatsappUrl: vi.fn(() => "https://wa.me/"),
  twitterUrl: vi.fn(() => "https://twitter.com/intent/tweet"),
  copyToClipboard: vi.fn(),
}));

import MeetingSchedulerPage from "../pages/MeetingSchedulerPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <MeetingSchedulerPage />
    </MemoryRouter>
  );
}

describe("MeetingSchedulerPage", () => {
  it("renders the page title", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "AI Meeting Planner" })).toBeInTheDocument();
  });

  it("renders meeting type selector", () => {
    renderPage();
    expect(screen.getByDisplayValue("1-on-1")).toBeInTheDocument();
  });

  it("renders duration selector", () => {
    renderPage();
    expect(screen.getByDisplayValue("30 minutes")).toBeInTheDocument();
  });

  it("renders generate button", () => {
    renderPage();
    expect(screen.getByText("Generate Agenda")).toBeInTheDocument();
  });

  it("renders attendee count input", () => {
    renderPage();
    const input = screen.getByDisplayValue("3");
    expect(input).toBeInTheDocument();
  });

  it("renders goal input", () => {
    renderPage();
    expect(screen.getByPlaceholderText("e.g. Discuss Q4 roadmap priorities")).toBeInTheDocument();
  });

  it("renders SEO info section", () => {
    renderPage();
    expect(screen.getByText("Why Meeting Agendas Matter")).toBeInTheDocument();
  });
});
