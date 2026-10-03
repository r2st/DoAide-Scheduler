import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));
vi.mock("../lib/track", () => ({ track: vi.fn() }));
vi.mock("../lib/share", () => ({
  embedSnippet: vi.fn((t) => `<iframe src="https://scheduler.doaide.com/${t}"></iframe>`),
  copyToClipboard: vi.fn(),
}));

import EmbedPage from "../pages/EmbedPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <EmbedPage />
    </MemoryRouter>
  );
}

describe("EmbedPage", () => {
  it("renders the page title", () => {
    renderPage();
    expect(screen.getByText(/Embed Scheduling Tools/)).toBeInTheDocument();
  });

  it("shows embed code", () => {
    renderPage();
    expect(screen.getByText(/iframe/)).toBeInTheDocument();
  });
});
