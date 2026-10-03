import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="card p-6 space-y-6">
        {/* Profile */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Profile</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Name</span>
              <p className="text-gray-900 dark:text-white">{user?.full_name || "—"}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Email</span>
              <p className="text-gray-900 dark:text-white">{user?.email}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Role</span>
              <p className="text-gray-900 dark:text-white capitalize">{user?.role}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Timezone</span>
              <p className="text-gray-900 dark:text-white">{user?.timezone || "UTC"}</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Business */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Business</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Name</span>
              <p className="text-gray-900 dark:text-white">{user?.business?.name}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Slug</span>
              <p className="text-gray-900 dark:text-white">/{user?.business?.slug}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Plan</span>
              <p className="text-gray-900 dark:text-white uppercase">{user?.business?.plan}</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Theme */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Appearance</h2>
          <div className="flex gap-3">
            {["light", "dark", "system"].map((t) => (
              <button
                key={t}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === t
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() => setTheme(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
