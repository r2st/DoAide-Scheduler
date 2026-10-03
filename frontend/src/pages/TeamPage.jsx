import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";

export default function TeamPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", full_name: "", role: "member", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    api.listTeamMembers().then(setMembers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    try {
      const member = await api.addTeamMember(form);
      setMembers([...members, member]);
      setShowForm(false);
      setForm({ email: "", full_name: "", role: "member", password: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemove(id) {
    await api.removeTeamMember(id);
    setMembers(members.filter((m) => m.id !== id));
  }

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team</h1>
        {user?.role === "owner" && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Member</button>
        )}
      </div>

      {showForm && (
        <div className="card p-6">
          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleAdd} className="space-y-4">
            <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input" placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Add Member</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card divide-y divide-gray-200 dark:divide-gray-700">
        {members.map((m) => (
          <div key={m.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{m.full_name || m.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{m.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {m.role}
              </span>
              {user?.role === "owner" && m.id !== user?.id && (
                <button className="text-xs text-red-500 hover:text-red-600" onClick={() => handleRemove(m.id)}>Remove</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
