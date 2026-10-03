import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));
vi.mock("../lib/track", () => ({ track: vi.fn() }));

import TimezonePage from "../pages/TimezonePage";

function renderPage() {
  return render(
    <MemoryRouter>
      <TimezonePage />
    </MemoryRouter>
  );
}

describe("TimezonePage", () => {
  it("renders the page title", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "World Timezone Converter" })).toBeInTheDocument();
  });

  it("shows timezone comparison", () => {
    renderPage();
    expect(screen.getAllByText(/London/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/India/).length).toBeGreaterThan(0);
  });
});
