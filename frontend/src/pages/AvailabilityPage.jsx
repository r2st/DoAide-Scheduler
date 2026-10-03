import { useEffect, useState } from "react";
import { api } from "../lib/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AvailabilityPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ day_of_week: 0, start_time: "09:00", end_time: "17:00" });

  useEffect(() => {
    api.listAvailability().then(setRules).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    const created = await api.createAvailability(form);
    setRules([...rules, created]);
    setShowForm(false);
  }

  async function handleDelete(id) {
    await api.deleteAvailability(id);
    setRules(rules.filter((r) => r.id !== id));
  }

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded" />;
  }

  const grouped = DAYS.map((day, i) => ({
    day,
    index: i,
    slots: rules.filter((r) => r.day_of_week === i),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Availability</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Slot</button>
      </div>

      {showForm && (
        <div className="card p-6">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Day</label>
                <select className="input" value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: parseInt(e.target.value) })}>
                  {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start</label>
                <input type="time" className="input" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End</label>
                <input type="time" className="input" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Add</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card divide-y divide-gray-200 dark:divide-gray-700">
        {grouped.map(({ day, slots }) => (
          <div key={day} className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">{day}</h3>
              {slots.length === 0 && <span className="text-sm text-gray-400">Unavailable</span>}
            </div>
            {slots.length > 0 && (
              <div className="mt-2 space-y-1">
                {slots.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{s.start_time} - {s.end_time}</span>
                    <button className="text-xs text-red-500 hover:text-red-600" onClick={() => handleDelete(s.id)}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
