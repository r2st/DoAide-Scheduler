import { Link } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function RemoteScheduling() {
  usePageTitle("Scheduling Best Practices for Remote Teams");

  return (
    <article className="blog-article">
      <h1>Scheduling Best Practices for Remote Teams</h1>
      <p className="blog-meta">Updated October 2026 &middot; 6 min read</p>

      <section>
        <h2>The Remote Scheduling Challenge</h2>
        <p>
          Remote work unlocked global talent, but it introduced a new puzzle: how do you schedule
          a meeting when your team spans 12 timezones? The answer is not "find a time that works
          for everyone" — it is building a system that respects everyone's time.
        </p>
      </section>

      <section>
        <h2>Establish Core Overlap Hours</h2>
        <p>
          Pick a 3-4 hour window where all team members are available during reasonable hours. This
          is your collaboration window — reserve it for meetings that need everyone. Everything else
          goes async.
        </p>
        <p>
          Use our <Link to="/timezone">Timezone Converter</Link> to find the overlap between your
          team's timezones instantly.
        </p>
      </section>

      <section>
        <h2>Default to Async</h2>
        <ul>
          <li><strong>Status updates:</strong> Use daily async standups in Slack or a project tool</li>
          <li><strong>Decisions:</strong> Write an RFC or decision doc, collect comments, then decide</li>
          <li><strong>Reviews:</strong> Record a Loom walkthrough instead of scheduling a live session</li>
          <li><strong>Questions:</strong> Post in a public channel so others benefit from the answer</li>
        </ul>
      </section>

      <section>
        <h2>Rotate Meeting Times</h2>
        <p>
          If your team spans more than 8 hours of timezone difference, no single meeting time is
          fair for everyone. Rotate weekly: Week 1 favors APAC, Week 2 favors EMEA, Week 3
          favors Americas. Record every meeting so no one misses context.
        </p>
      </section>

      <section>
        <h2>Booking Links Over Back-and-Forth</h2>
        <p>
          Stop the "when are you free?" email chain. Share a booking link that shows your real-time
          availability, automatically adjusts for the booker's timezone, and sends calendar invites
          to everyone.
        </p>
        <p>
          DoAide Scheduler creates booking pages that handle timezone detection, calendar sync, and
          reminder emails automatically.
        </p>
        <p>
          <Link to="/">Try DoAide Scheduler free &rarr;</Link>
        </p>
      </section>
    </article>
  );
}
