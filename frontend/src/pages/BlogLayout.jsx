import { Link, Outlet } from "react-router-dom";
import MeetingProductivity from "./blog/MeetingProductivity";
import RemoteScheduling from "./blog/RemoteScheduling";
import CalendarManagement from "./blog/CalendarManagement";
import AiSchedulingSaves from "./blog/AiSchedulingSaves";
import AutomatedBookingGuide from "./blog/AutomatedBookingGuide";
import SmartSchedulingBoosts from "./blog/SmartSchedulingBoosts";

const ARTICLES = [
  {
    slug: "ai-scheduling-saves-time",
    title: "How AI Scheduling Saves 10+ Hours Per Week",
    description: "Discover where your scheduling hours go and how AI automation eliminates the overhead entirely.",
    component: AiSchedulingSaves,
  },
  {
    slug: "automated-appointment-booking-guide",
    title: "The Complete Guide to Automated Appointment Booking",
    description: "Set up self-service booking pages, availability rules, reminders, and integrations step by step.",
    component: AutomatedBookingGuide,
  },
  {
    slug: "smart-scheduling-customer-satisfaction",
    title: "5 Ways Smart Scheduling Boosts Customer Satisfaction",
    description: "From instant self-service booking to smart reminders — how scheduling becomes a competitive advantage.",
    component: SmartSchedulingBoosts,
  },
  {
    slug: "meeting-productivity-guide",
    title: "The Complete Guide to Meeting Productivity",
    description: "Run fewer, better meetings. Learn frameworks for agendas, time-boxing, and async alternatives.",
    component: MeetingProductivity,
  },
  {
    slug: "remote-team-scheduling",
    title: "Scheduling Best Practices for Remote Teams",
    description: "How distributed teams coordinate across timezones without burning out or losing alignment.",
    component: RemoteScheduling,
  },
  {
    slug: "calendar-management-tips",
    title: "Calendar Management Tips for Busy Professionals",
    description: "Take control of your calendar with time-blocking, buffer zones, and smart defaults.",
    component: CalendarManagement,
  },
];

export { ARTICLES };

export default function BlogLayout() {
  return (
    <div className="blog-layout">
      <header className="blog-header">
        <Link to="/" className="blog-home-link">&larr; Back to DoAide Scheduler</Link>
        <h1 className="blog-title">DoAide Scheduler Blog</h1>
        <p className="blog-subtitle">Guides and resources for better meetings and scheduling</p>
      </header>
      <Outlet />
    </div>
  );
}

export function BlogIndex() {
  return (
    <div className="blog-index">
      {ARTICLES.map((a) => (
        <Link key={a.slug} to={`/blog/${a.slug}`} className="blog-card">
          <h2>{a.title}</h2>
          <p>{a.description}</p>
          <span className="blog-read-more">Read more &rarr;</span>
        </Link>
      ))}
    </div>
  );
}
