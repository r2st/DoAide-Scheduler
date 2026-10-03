import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function CalendarPage() {
  const [connections, setConnections] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    Promise.all([api.listCalendarConnections(), api.listBookings()])
      .then(([c, b]) => {
        setConnections(c);
        setBookings(b);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function connectGoogle() {
    try {
      const data = await api.calendarConnectGoogle();
      window.open(data.auth_url, "_blank");
    } catch (err) {
      alert(err.message);
    }
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  function bookingsForDay(day) {
    if (!day) return [];
    return bookings.filter((b) => {
      const d = new Date(b.start_time);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
        && (b.status === "confirmed" || b.status === "pending");
    });
  }

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <div className="flex gap-2">
          {connections.length === 0 && (
            <button className="btn-secondary text-sm" onClick={connectGoogle}>
              Connect Google Calendar
            </button>
          )}
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button className="btn-secondary text-sm" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
          ← Previous
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <button className="btn-secondary text-sm" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dayBookings = bookingsForDay(day);
            const isToday = day && new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
            return (
              <div key={i} className={`min-h-[80px] p-1 border-b border-r border-gray-200 dark:border-gray-700 ${day ? "" : "bg-gray-50 dark:bg-gray-800/50"}`}>
                {day && (
                  <>
                    <span className={`text-xs font-medium ${isToday ? "bg-brand-500 text-white px-1.5 py-0.5 rounded-full" : "text-gray-700 dark:text-gray-300"}`}>
                      {day}
                    </span>
                    {dayBookings.slice(0, 2).map((b) => (
                      <div key={b.id} className="mt-0.5 px-1 py-0.5 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded text-[10px] truncate">
                        {new Date(b.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {b.guest_name}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-[10px] text-gray-400 px-1">+{dayBookings.length - 2} more</div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Connections */}
      {connections.length > 0 && (
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Connected Calendars</h3>
          {connections.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {c.provider} {c.is_active ? "✓" : "✗"}
              </span>
              <button className="text-xs text-red-500" onClick={() => api.disconnectCalendar(c.id).then(() => setConnections(connections.filter((cc) => cc.id !== c.id)))}>
                Disconnect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
