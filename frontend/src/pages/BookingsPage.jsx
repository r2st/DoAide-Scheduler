import { useEffect, useState } from "react";
import { api } from "../lib/api";

const STATUS_COLORS = {
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  rescheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  no_show: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.listBookings(filter || undefined).then(setBookings).catch(() => {}).finally(() => setLoading(false));
  }, [filter]);

  async function handleCancel(id) {
    await api.updateBooking(id, { status: "cancelled" });
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
  }

  async function handleConfirm(id) {
    await api.updateBooking(id, { status: "confirmed" });
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b)));
  }

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
        <select className="input w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {bookings.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
          No bookings found.
        </div>
      ) : (
        <div className="card divide-y divide-gray-200 dark:divide-gray-700">
          {bookings.map((b) => (
            <div key={b.id} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-gray-900 dark:text-white">{b.guest_name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] || ""}`}>
                    {b.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{b.guest_email}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(b.start_time).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(b.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {" - "}
                    {new Date(b.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex gap-2">
                  {b.status === "pending" && (
                    <button className="text-xs text-brand-500 hover:text-brand-600" onClick={() => handleConfirm(b.id)}>
                      Confirm
                    </button>
                  )}
                  {(b.status === "confirmed" || b.status === "pending") && (
                    <button className="text-xs text-red-500 hover:text-red-600" onClick={() => handleCancel(b.id)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
