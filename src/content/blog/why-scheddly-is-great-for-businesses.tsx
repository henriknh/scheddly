import { BlogPost } from "./posts";

const post: BlogPost = {
  slug: "why-scheddly-is-great-for-businesses",
  title: "Why Scheddly is great for businesses",
  description:
    "Organize social by brand, standardize how your team posts, and keep content consistent as you scale.",
  publishedAt: "2025-08-11T08:45:00.000Z",
  tags: ["Teams", "Workflow", "Branding"],
  readTimeMinutes: 6,
  coverImageUrl: "/blog/cover-images/why-scheddly-is-great-for-businesses.png",
  content: () => (
    <article className="flex flex-col gap-4">
      <p>
        Growing teams need clarity more than features. Scheddly organizes social
        around brands so your integrations, assets, and defaults live where they
        belong — making consistency the default, not a chore.
      </p>

      <h2 className="text-xl font-semibold">Brand-first structure</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <span className="font-medium">Everything by brand:</span> Keep
          integrations, assets, and posting rules scoped to each brand.
        </li>
        <li>
          <span className="font-medium">Clear ownership:</span> Assign work by
          brand to reduce context switching.
        </li>
      </ul>

      <h2 className="text-xl font-semibold">Scale content without chaos</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Plan campaigns on a shared calendar everyone understands.</li>
        <li>Standardize bios, links, and offer messaging across profiles.</li>
        <li>Reuse proven posts and adapt them quickly per channel.</li>
      </ul>

      <h2 className="text-xl font-semibold">Why businesses choose Scheddly</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Brand consistency built in.</li>
        <li>Simple workflows teams actually follow.</li>
        <li>Less rework, faster approvals, clearer accountability.</li>
      </ul>

      <div className="pt-2">
        <a href="/auth/register" className="inline-flex items-center gap-2">
          <span className="underline font-medium">Get your team set up</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  ),
};

export default post;
