import { BlogPost } from "./posts";

const post: BlogPost = {
  slug: "why-scheddly-is-great-for-individuals",
  title: "Why Scheddly is great for individuals",
  description:
    "For creators and solo operators: a simple, fast way to plan, create, and schedule social posts without the busywork.",
  publishedAt: "2025-08-11T08:30:00.000Z",
  tags: ["Productivity", "Creators", "Solo"],
  readTimeMinutes: 6,
  coverImageUrl: "/blog/cover-images/why-scheddly-is-great-for-individuals.png",
  content: () => (
    <article className="flex flex-col gap-4">
      <p>
        If you handle your own social, you need tools that stay out of the way.
        Scheddly focuses on speed and clarity so you can spend more time making
        great content — and less time clicking through menus.
      </p>

      <h2 className="text-xl font-semibold">Built for momentum</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <span className="font-medium">Plan once, post everywhere:</span> Queue
          content across your connected platforms in one pass.
        </li>
        <li>
          <span className="font-medium">Reusable building blocks:</span> Save
          your best captions, hashtags, and link formats as go-to patterns.
        </li>
        <li>
          <span className="font-medium">Visual calendar:</span> See what&apos;s
          going out and when — no spreadsheets required.
        </li>
      </ul>

      <h2 className="text-xl font-semibold">Stay consistent without burnout</h2>
      <p>
        Consistency wins. Scheddly removes repetitive work so you can batch,
        schedule, and move on. Your future self will thank you.
      </p>

      <h3 className="font-semibold">A simple weekly routine</h3>
      <ol className="list-decimal pl-6 space-y-2">
        <li>Pick 3 content pillars for the week.</li>
        <li>Draft 5–8 posts using saved formats and assets.</li>
        <li>Schedule to your preferred days and times.</li>
      </ol>

      <h2 className="text-xl font-semibold">Why individuals choose Scheddly</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Fast to learn, faster to use.</li>
        <li>No clutter — just what you need to ship content.</li>
        <li>Brand-first structure scales with you as you grow.</li>
      </ul>

      <div className="pt-2">
        <a href="/auth/register" className="inline-flex items-center gap-2">
          <span className="underline font-medium">Start free in minutes</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  ),
};

export default post;
