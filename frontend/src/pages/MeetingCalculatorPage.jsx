import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShareButtons from "../components/ShareButtons";
import ToolsNav from "../components/ToolsNav";
import { usePageTitle } from "../hooks/usePageTitle";
import { track } from "../lib/track";

function parseParams(search) {
  const p = new URLSearchParams(search);
  return {
    attendees: parseInt(p.get("attendees"), 10) || 6,
    rate: parseInt(p.get("rate"), 10) || 75,
    duration: parseInt(p.get("duration"), 10) || 60,
    frequency: p.get("frequency") || "weekly",
  };
}

function calcUrl(attendees, rate, duration, frequency) {
  return `/calculator?attendees=${attendees}&rate=${rate}&duration=${duration}&frequency=${encodeURIComponent(frequency)}`;
}

const FREQUENCIES = [
  { value: "daily", label: "Daily", perYear: 260 },
  { value: "weekly", label: "Weekly", perYear: 52 },
  { value: "biweekly", label: "Bi-weekly", perYear: 26 },
  { value: "monthly", label: "Monthly", perYear: 12 },
];

const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function MeetingCalculatorPage() {
  usePageTitle("Free Meeting Cost Calculator — How Much Do Meetings Cost?");
  const location = useLocation();
  const navigate = useNavigate();

  const initial = parseParams(location.search);
  const [attendees, setAttendees] = useState(initial.attendees);
  const [rate, setRate] = useState(initial.rate);
  const [duration, setDuration] = useState(initial.duration);
  const [frequency, setFrequency] = useState(initial.frequency);

  const freqObj = FREQUENCIES.find((f) => f.value === frequency) || FREQUENCIES[1];
  const costPerMeeting = Math.round(attendees * (rate / 60) * duration);
  const annualCost = costPerMeeting * freqObj.perYear;
  const hoursPerYear = Math.round((attendees * duration * freqObj.perYear) / 60);

  useEffect(() => {
    const url = calcUrl(attendees, rate, duration, frequency);
    if (location.search !== url.replace("/calculator", "")) {
      navigate(url, { replace: true });
    }
  }, [attendees, rate, duration, frequency, navigate, location.search]);

  useEffect(() => {
    track("meeting_calculate", { attendees, rate, duration, frequency, costPerMeeting });
  }, [attendees, rate, duration, frequency, costPerMeeting]);

  return (
    <div className="tool-page">
      <ToolsNav />
      <main className="tool-main">
        <div className="tool-container">
          <h1 className="tool-title">Meeting Cost Calculator</h1>
          <p className="tool-subtitle">
            Find out how much your meetings really cost. No sign-up required.
          </p>

          <div className="calc-card">
            <label className="calc-label">
              Number of Attendees
              <input type="number" className="calc-input" value={attendees} onChange={(e) => setAttendees(Math.max(1, parseInt(e.target.value, 10) || 1))} min="1" max="100" />
            </label>

            <label className="calc-label">
              Average Hourly Rate ($)
              <input type="number" className="calc-input" value={rate} onChange={(e) => setRate(Math.max(1, parseInt(e.target.value, 10) || 1))} min="1" step="5" />
            </label>

            <label className="calc-label">
              Duration (minutes)
              <input type="number" className="calc-input" value={duration} onChange={(e) => setDuration(Math.max(5, parseInt(e.target.value, 10) || 5))} min="5" max="480" step="5" />
            </label>

            <label className="calc-label">
              Frequency
              <select className="calc-select" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </label>

            <div className="calc-result" aria-live="polite">
              <div className="calc-result-row">
                <span>Cost per Meeting</span>
                <strong>{fmt(costPerMeeting)}</strong>
              </div>
              <div className="calc-result-row">
                <span>Meetings per Year</span>
                <strong>{freqObj.perYear}</strong>
              </div>
              <div className="calc-result-row">
                <span>Person-Hours per Year</span>
                <strong>{hoursPerYear.toLocaleString()}</strong>
              </div>
              <div className="calc-result-row calc-total">
                <span>Annual Meeting Cost</span>
                <strong>{fmt(annualCost)}</strong>
              </div>

              <ShareButtons
                path={calcUrl(attendees, rate, duration, frequency)}
                text={`Our ${freqObj.label.toLowerCase()} meeting costs ${fmt(costPerMeeting)} each time — ${fmt(annualCost)}/year! Calculate yours free on DoAide Scheduler`}
              />
            </div>
          </div>

          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "DoAide Meeting Cost Calculator",
            "url": "https://scheduler.doaide.com/tools/meeting-cost-calculator",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "description": "Calculate how much your meetings really cost. Free, no sign-up required.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          }) }} />

          <section className="tool-info">
            <h2>Why Meeting Costs Matter</h2>
            <p>
              Meetings are one of the largest hidden costs in any organization. A weekly 1-hour
              meeting with 8 people earning $75/hr costs over $31,000 per year. Understanding
              this cost helps teams prioritize which meetings are worth having.
            </p>
            <h3>Tips to Reduce Meeting Costs</h3>
            <ul>
              <li>Only invite people who truly need to be there</li>
              <li>Set a clear agenda and stick to it</li>
              <li>Default to 25 or 50 minutes instead of 30 or 60</li>
              <li>Replace status updates with async check-ins</li>
              <li>Use DoAide Scheduler to automate scheduling and reduce back-and-forth</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
