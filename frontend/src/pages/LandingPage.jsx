import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LandingPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ email, password, business_name: businessName, full_name: fullName });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Hero */}
      <header className="text-center py-16 px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-5xl font-bold text-brand-500">S</span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">DoAide Scheduler</h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          AI-powered meeting scheduler for businesses. Share your booking link,
          let clients pick a time, and never double-book again.
        </p>
      </header>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 pb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: "📅", title: "Smart Scheduling", desc: "Set your availability and let AI handle the rest" },
          { icon: "🔗", title: "Booking Links", desc: "Share personalized links for each meeting type" },
          { icon: "👥", title: "Team Scheduling", desc: "Round-robin and collective availability for teams" },
        ].map((f) => (
          <div key={f.title} className="card p-6 text-center">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Auth Form */}
      <section className="max-w-md mx-auto px-4 pb-16 w-full">
        <div className="card p-6">
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                mode === "login"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                mode === "register"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setMode("register")}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <input
                  type="text"
                  placeholder="Business name"
                  className="input"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Your full name"
                  className="input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Free", price: "$0", features: ["20 meetings/month", "1 meeting type", "Email notifications"] },
            { name: "Pro", price: "$12/mo", features: ["Unlimited meetings", "Unlimited types", "Google Calendar sync", "Custom branding"] },
            { name: "Team", price: "$25/mo", features: ["Everything in Pro", "Team scheduling", "Round-robin", "Analytics"] },
          ].map((plan) => (
            <div key={plan.name} className={`card p-6 ${plan.name === "Pro" ? "ring-2 ring-brand-500" : ""}`}>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{plan.name}</h3>
              <p className="text-3xl font-bold text-brand-500 my-3">{plan.price}</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-brand-500">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
