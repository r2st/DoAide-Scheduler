import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));
vi.mock("../lib/track", () => ({ track: vi.fn() }));

import SchedulingTemplatesPage from "../pages/SchedulingTemplatesPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <SchedulingTemplatesPage />
    </MemoryRouter>
  );
}

describe("SchedulingTemplatesPage", () => {
  it("renders the page title", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "Scheduling Templates" })).toBeInTheDocument();
  });

  it("shows all six templates", () => {
    renderPage();
    expect(screen.getByText("1-on-1 Meeting")).toBeInTheDocument();
    expect(screen.getByText("Team Standup")).toBeInTheDocument();
    expect(screen.getByText("Client Call")).toBeInTheDocument();
    expect(screen.getByText("Interview")).toBeInTheDocument();
    expect(screen.getByText("Product Demo")).toBeInTheDocument();
    expect(screen.getByText("Office Hours")).toBeInTheDocument();
  });
});
