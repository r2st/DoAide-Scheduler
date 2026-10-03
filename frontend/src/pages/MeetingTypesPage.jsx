import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function MeetingTypesPage() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", duration_minutes: 30, color: "#10B981" });
  const [error, setError] = useState("");

  useEffect(() => {
    api.listMeetingTypes().then(setTypes).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        const updated = await api.updateMeetingType(editId, form);
        setTypes(types.map((t) => (t.id === editId ? updated : t)));
      } else {
        const created = await api.createMeetingType(form);
        setTypes([...types, created]);
      }
      setShowForm(false);
      setEditId(null);
      setForm({ name: "", description: "", duration_minutes: 30, color: "#10B981" });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    await api.deleteMeetingType(id);
    setTypes(types.filter((t) => t.id !== id));
  }

  function startEdit(mt) {
    setForm({ name: mt.name, description: mt.description || "", duration_minutes: mt.duration_minutes, color: mt.color });
    setEditId(mt.id);
    setShowForm(true);
  }

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meeting Types</h1>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", description: "", duration_minutes: 30, color: "#10B981" }); }}>
          + New Type
        </button>
      </div>

      {showForm && (
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            {editId ? "Edit Meeting Type" : "Create Meeting Type"}
          </h2>
          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input" placeholder="Meeting name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <textarea className="input" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
                <input type="number" className="input" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 30 })} min={5} max={480} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                <input type="color" className="w-full h-10 rounded-lg cursor-pointer" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{editId ? "Save" : "Create"}</button>
              <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {types.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
          No meeting types yet. Create one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map((mt) => (
            <div key={mt.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mt.color }} />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{mt.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{mt.duration_minutes} min</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs text-gray-500 hover:text-brand-500" onClick={() => startEdit(mt)}>Edit</button>
                  <button className="text-xs text-gray-500 hover:text-red-500" onClick={() => handleDelete(mt.id)}>Delete</button>
                </div>
              </div>
              {mt.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{mt.description}</p>}
              <div className="mt-3 text-xs text-gray-400">/{mt.slug}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
