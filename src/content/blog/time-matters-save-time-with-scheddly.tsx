import { BlogPost } from "./posts";

const post: BlogPost = {
  slug: "time-matters-save-time-with-scheddly",
  title: "Time matters — How to use Scheddly to save time",
  description:
    "A practical system to plan, batch, and schedule social content so you reclaim hours every week.",
  publishedAt: "2025-08-11T09:00:00.000Z",
  tags: ["Productivity", "Scheduling", "Tips"],
  readTimeMinutes: 7,
  coverImageUrl: "/blog/cover-images/time-matters-save-time-with-scheddly.jpg",
  content: () => (
    <article className="flex flex-col gap-4">
      <p>
        Every minute you spend formatting a post is time not spent improving
        your message. Here&apos;s a simple, repeatable workflow to cut the
        busywork and keep content shipping.
      </p>

      <h2 className="text-xl font-semibold">The 90-minute weekly workflow</h2>
      <ol className="list-decimal pl-6 space-y-2">
        <li>
          <span className="font-medium">Plan (15 min):</span> Choose 3 content
          pillars and define your core call to action.
        </li>
        <li>
          <span className="font-medium">Draft (45 min):</span> Write 6—10 posts
          using saved caption formats and assets.
        </li>
        <li>
          <span className="font-medium">Schedule (30 min):</span> Queue posts
          across platforms and assign days/times.
        </li>
      </ol>

      <h2 className="text-xl font-semibold">Small habits that save big time</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Keep a running swipe file of hooks and CTAs inside your brand.</li>
        <li>Reuse formats — don&apos;t re-invent the wheel for every post.</li>
        <li>Batch similar tasks: write, then design, then schedule.</li>
      </ul>

      <h2 className="text-xl font-semibold">How Scheddly helps</h2>
      <p>
        Scheddly centralizes your integrations, assets, and posting defaults by
        brand so you can plan once and distribute everywhere — without context
        switching.
      </p>

      <div className="pt-2">
        <a href="/auth/register" className="inline-flex items-center gap-2">
          <span className="underline font-medium">
            Save your next 90 minutes
          </span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  ),
};

export default post;
