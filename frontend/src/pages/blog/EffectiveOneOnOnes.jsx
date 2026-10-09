import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function EffectiveOneOnOnes() {
  usePageTitle("How to Run Effective One-on-One Meetings — DoAide Scheduler Blog");

  return (
    <article className="blog-article">
      <h1>How to Run Effective One-on-One Meetings</h1>
      <p className="blog-meta">October 2026 &middot; 7 min read</p>

      <section>
        <h2>Why One-on-Ones Are the Most Important Meeting on Your Calendar</h2>
        <p>
          One-on-one meetings are the foundation of effective management. They build trust,
          surface problems early, and give both managers and direct reports dedicated time to
          align on priorities. Yet most one-on-ones fall into predictable traps: they become
          status updates, they get cancelled when things are busy, or they lack structure
          entirely.
        </p>
        <p>
          The best managers treat one-on-ones as the direct report's meeting, not theirs.
          The goal is to listen, coach, and remove blockers — not to micromanage or collect
          project updates that belong in a standup.
        </p>
      </section>

      <section>
        <h2>The Ideal One-on-One Structure</h2>
        <h3>Before the Meeting</h3>
        <p>
          Both parties should add topics to a shared agenda at least a few hours before the
          meeting. This prevents the awkward "so, what do you want to talk about?" opening
          and ensures important topics don't get forgotten. Use our{" "}
          <Link to="/tools/meeting-planner">AI Meeting Planner</Link> to generate a
          structured agenda template for your one-on-ones.
        </p>

        <h3>Opening (5 minutes)</h3>
        <p>
          Start with a genuine check-in. How are they doing — not just at work, but in
          general? This isn't small talk; it's how you build the psychological safety that
          makes the rest of the conversation productive.
        </p>

        <h3>Their Topics (15 minutes)</h3>
        <p>
          Let the direct report drive this section. Common topics include blockers they need
          help with, feedback on recent work, career development questions, and concerns about
          team dynamics. Resist the urge to jump in with solutions immediately — ask questions
          first.
        </p>

        <h3>Your Topics (5 minutes)</h3>
        <p>
          Share context they might not have: upcoming org changes, feedback from stakeholders,
          or strategic priorities that affect their work. Keep this brief — if you need more
          time for your topics, the meeting has become about you, not them.
        </p>

        <h3>Action Items (5 minutes)</h3>
        <p>
          End with clear next steps. Who is doing what, by when? Write them down in a shared
          doc and review them at the start of the next one-on-one.
        </p>
      </section>

      <section>
        <h2>Common One-on-One Mistakes</h2>
        <ul>
          <li>
            <strong>Cancelling when busy.</strong> This sends the message that the relationship
            isn't important. Reschedule instead of cancelling.
          </li>
          <li>
            <strong>Using it for status updates.</strong> If you need project status, read the
            standup notes or check the project board. One-on-ones are for coaching and
            relationship-building.
          </li>
          <li>
            <strong>Doing all the talking.</strong> If you're speaking more than 30% of the
            time, you're using the meeting wrong.
          </li>
          <li>
            <strong>Skipping career conversations.</strong> At least once a quarter, dedicate
            the entire one-on-one to career growth, goals, and development.
          </li>
          <li>
            <strong>No follow-through.</strong> Action items that never get done erode trust
            faster than anything else.
          </li>
        </ul>
      </section>

      <section>
        <h2>One-on-One Frequency and Duration</h2>
        <p>
          Weekly 30-minute one-on-ones work best for most teams. Bi-weekly is acceptable for
          senior, autonomous team members. Monthly is too infrequent — problems compound,
          context is lost, and the meetings become surface-level.
        </p>
        <p>
          Use our <Link to="/tools/meeting-cost-calculator">Meeting Cost Calculator</Link> to
          understand the investment and ensure you're getting the return.
        </p>
      </section>

      <section>
        <h2>Making One-on-Ones Easy to Schedule</h2>
        <p>
          The biggest barrier to consistent one-on-ones is the scheduling overhead. When you
          have 6+ direct reports, finding and protecting 30-minute weekly slots across
          everyone's calendar is a real challenge. Automated scheduling tools eliminate this
          friction entirely.
        </p>
        <p>
          <Link to="/">Try DoAide Scheduler free &rarr;</Link>
        </p>
      </section>
    </article>
  );
}
