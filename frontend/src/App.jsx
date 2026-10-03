import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Shell from "./components/Shell";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import MeetingTypesPage from "./pages/MeetingTypesPage";
import BookingsPage from "./pages/BookingsPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import CalendarPage from "./pages/CalendarPage";
import TeamPage from "./pages/TeamPage";
import SettingsPage from "./pages/SettingsPage";
import PricingPage from "./pages/PricingPage";
import PublicBookingPage from "./pages/PublicBookingPage";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/book/:businessSlug/:meetingSlug" element={<PublicBookingPage />} />
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route
        element={
          <Protected>
            <Shell />
          </Protected>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meeting-types" element={<MeetingTypesPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Route>
    </Routes>
  );
}
