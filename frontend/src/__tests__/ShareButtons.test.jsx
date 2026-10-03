import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../lib/share", () => ({
  fullUrl: vi.fn((p) => `https://scheduler.doaide.com${p}`),
  whatsappUrl: vi.fn(() => "https://wa.me/?text=test"),
  twitterUrl: vi.fn(() => "https://twitter.com/intent/tweet?text=test"),
  copyToClipboard: vi.fn(() => Promise.resolve(true)),
}));
vi.mock("../lib/track", () => ({ track: vi.fn() }));

import ShareButtons from "../components/ShareButtons";

function renderButtons() {
  return render(
    <MemoryRouter>
      <ShareButtons path="/test" text="Test share text" />
    </MemoryRouter>
  );
}

describe("ShareButtons", () => {
  it("renders WhatsApp share link", () => {
    renderButtons();
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp").closest("a")).toHaveAttribute("href", "https://wa.me/?text=test");
  });

  it("renders Twitter share link", () => {
    renderButtons();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("Twitter").closest("a")).toHaveAttribute("href", "https://twitter.com/intent/tweet?text=test");
  });

  it("renders copy link button", () => {
    renderButtons();
    expect(screen.getByText("Copy link")).toBeInTheDocument();
  });
});
