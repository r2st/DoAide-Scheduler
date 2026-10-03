import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function PublicBookingPage() {
  const { businessSlug, meetingSlug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({ guest_name: "", guest_email: "", notes: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    api.getPublicBookingPage(businessSlug, meetingSlug)
      .then(setPageData)
      .catch(() => setError("Booking page not found"))
      .finally(() => setLoading(false));
  }, [businessSlug, meetingSlug]);

  useEffect(() => {
    if (!selectedDate) return;
    api.getPublicSlots(businessSlug, meetingSlug, selectedDate)
      .then(setSlots)
      .catch(() => setSlots([]));
  }, [selectedDate, businessSlug, meetingSlug]);

  async function handleBook(e) {
    e.preventDefault();
    setError("");
    try {
      const result = await api.createPublicBooking(businessSlug, meetingSlug, {
        start_time: selectedSlot.start,
        ...form,
      });
      setBooking(result);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-pulse h-64 w-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    );
  }

  if (booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your meeting has been scheduled for{" "}
            {new Date(booking.start_time).toLocaleString()}.
          </p>
          <p className="text-sm text-gray-500">A confirmation email has been sent to {booking.guest_email}.</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="card p-8 text-center">
          <h2 className="text-xl font-bold text-red-500">Not Found</h2>
          <p className="text-gray-500 mt-2">{error || "This booking page does not exist."}</p>
        </div>
      </div>
    );
  }

  const { business, meeting_type } = pageData;

  // Generate next 14 days for date selection
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 flex items-start justify-center pt-12">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{business.name}</h1>
          <h2 className="text-lg text-brand-500 font-semibold mt-1">{meeting_type.name}</h2>
          {meeting_type.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">{meeting_type.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">{meeting_type.duration_minutes} minutes</p>
        </div>

        {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 text-sm text-center">{error}</div>}

        {/* Date Selection */}
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Select a Date</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dates.map((d) => (
              <button
                key={d}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedDate === d
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
              >
                <div className="font-medium">{new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div>{new Date(d + "T00:00:00").getDate()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Available Times</h3>
            {slots.length === 0 ? (
              <p className="text-gray-500 text-sm">No available slots for this date.</p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {slots.map((s) => (
                  <button
                    key={s.start}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedSlot?.start === s.start
                        ? "bg-brand-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => setSelectedSlot(s)}
                  >
                    {new Date(s.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Booking Form */}
        {selectedSlot && (
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Your Details</h3>
            <form onSubmit={handleBook} className="space-y-4">
              <input className="input" placeholder="Your name" value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} required />
              <input className="input" placeholder="Your email" type="email" value={form.guest_email} onChange={(e) => setForm({ ...form, guest_email: e.target.value })} required />
              <textarea className="input" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
              <button type="submit" className="btn-primary w-full">
                Book Meeting
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
