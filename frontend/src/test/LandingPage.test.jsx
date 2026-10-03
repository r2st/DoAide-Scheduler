import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import LandingPage from '../pages/LandingPage';

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    register: vi.fn(),
    loading: false,
    error: null,
  }),
}));

function renderLanding() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  it('renders hero heading', () => {
    renderLanding();
    expect(screen.getByText(/Smart Scheduling/)).toBeInTheDocument();
  });

  it('renders all 6 feature cards', () => {
    renderLanding();
    expect(screen.getByText('Smart Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Booking Links')).toBeInTheDocument();
    expect(screen.getByText('Team Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Calendar Sync')).toBeInTheDocument();
    expect(screen.getByText('Custom Branding')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('renders how-it-works section', () => {
    renderLanding();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders pricing section with 3 tiers', () => {
    renderLanding();
    expect(screen.getByText('Simple, Transparent Pricing')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$12')).toBeInTheDocument();
    expect(screen.getByText('$25')).toBeInTheDocument();
  });

  it('renders testimonials', () => {
    renderLanding();
    expect(screen.getByText(/Alex R\./)).toBeInTheDocument();
    expect(screen.getByText(/Maria L\./)).toBeInTheDocument();
    expect(screen.getByText(/David C\./)).toBeInTheDocument();
  });

  it('renders FAQ section with accordion', async () => {
    renderLanding();
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();

    const firstQ = screen.getByText('How does DoAide Scheduler prevent double-booking?');
    const user = userEvent.setup();
    await user.click(firstQ);
    expect(screen.getByText(/syncs with your calendar/)).toBeInTheDocument();
  });

  it('renders auth form with login and register tabs', () => {
    renderLanding();
    expect(screen.getAllByText(/Sign In/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sign Up/).length).toBeGreaterThan(0);
  });

  it('renders footer with DoAide products', () => {
    renderLanding();
    expect(screen.getByText('DoAide Products')).toBeInTheDocument();
    expect(screen.getByText('doaide.com')).toBeInTheDocument();
  });

  it('renders free tools section', () => {
    renderLanding();
    expect(screen.getByText('Free Scheduling Tools')).toBeInTheDocument();
    expect(screen.getAllByText(/Meeting Cost Calculator/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Timezone Converter/).length).toBeGreaterThan(0);
  });
});
