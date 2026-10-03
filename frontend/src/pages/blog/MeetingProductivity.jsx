import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function MeetingProductivity() {
  usePageTitle("The Complete Guide to Meeting Productivity");

  return (
    <article className="blog-article">
      <h1>The Complete Guide to Meeting Productivity</h1>
      <p className="blog-meta">Updated October 2026 &middot; 7 min read</p>

      <section>
        <h2>The Meeting Problem</h2>
        <p>
          The average professional spends 31 hours per month in unproductive meetings. That is
          nearly four full workdays lost to gatherings that could have been emails, Slack messages,
          or short async updates. The cost is not just time — it is focus, energy, and morale.
        </p>
      </section>

      <section>
        <h2>Before the Meeting: Do You Even Need One?</h2>
        <p>Ask yourself three questions before scheduling:</p>
        <ol>
          <li>Does this require real-time discussion, or can it be async?</li>
          <li>Do all invitees need to be there, or can a smaller group decide and share out?</li>
          <li>Is the outcome clear — a decision, a plan, or alignment?</li>
        </ol>
        <p>
          If the answer to any is no, consider an alternative: a shared doc, a Loom video, a
          Slack thread, or a quick poll.
        </p>
      </section>

      <section>
        <h2>The Perfect Agenda</h2>
        <p>Every productive meeting has a written agenda shared at least 24 hours in advance. A good agenda includes:</p>
        <ul>
          <li>The purpose: what decision or outcome this meeting will produce</li>
          <li>Topics with time boxes (e.g., "Budget review — 10 min")</li>
          <li>Pre-reads or context links so attendees arrive prepared</li>
          <li>Who owns each topic</li>
        </ul>
      </section>

      <section>
        <h2>During the Meeting</h2>
        <h3>Start on Time, End Early</h3>
        <p>
          Default to 25-minute or 50-minute meetings instead of 30 or 60. The 5-minute buffer
          prevents back-to-back meeting fatigue and gives people time to process.
        </p>

        <h3>Assign Roles</h3>
        <p>
          Every meeting needs a facilitator (keeps things on track), a note-taker (captures
          decisions and action items), and a timekeeper. Rotate these roles weekly.
        </p>

        <h3>End with Action Items</h3>
        <p>
          The last two minutes should be: "Who is doing what by when?" If a meeting ends
          without clear next steps, it was a conversation, not a meeting.
        </p>
      </section>

      <section>
        <h2>Use the Right Tools</h2>
        <p>
          DoAide Scheduler automates the logistics so you can focus on the substance. Share booking
          links, sync calendars across timezones, and set smart defaults for meeting duration and
          buffer time.
        </p>
        <p>
          Use our free <Link to="/calculator">Meeting Cost Calculator</Link> to see how much your
          recurring meetings actually cost your team.
        </p>
      </section>
    </article>
  );
}
