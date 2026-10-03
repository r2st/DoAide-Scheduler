const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "20 meetings/month",
      "1 meeting type",
      "Email notifications",
      "Basic availability settings",
      "Shareable booking links",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    features: [
      "Unlimited meetings",
      "Unlimited meeting types",
      "Google Calendar sync",
      "Custom branding",
      "Buffer times",
      "Email reminders",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$25",
    period: "/month",
    features: [
      "Everything in Pro",
      "Team scheduling",
      "Round-robin assignment",
      "Collective availability",
      "Team analytics",
      "Admin controls",
      "API access",
    ],
    cta: "Start Team Plan",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pricing</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Choose the plan that fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`card p-6 flex flex-col ${
              plan.highlighted ? "ring-2 ring-brand-500 relative" : ""
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold text-brand-500">{plan.price}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{plan.period}</span>
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-brand-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className={plan.highlighted ? "btn-primary w-full" : "btn-secondary w-full"}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
