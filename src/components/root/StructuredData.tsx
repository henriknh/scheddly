import config from "@/config";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.appName,
    description: config.appDescription,
    url: config.appUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free 7-day trial",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
    author: {
      "@type": "Organization",
      name: config.appAuthor,
    },
    publisher: {
      "@type": "Organization",
      name: config.appName,
      logo: {
        "@type": "ImageObject",
        url: `${config.appUrl}${config.appImage}`,
      },
    },
    featureList: [
      "Social media scheduling",
      "Multi-platform posting",
      "Analytics and insights",
      "Team collaboration",
      "E-commerce integration",
    ],
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.appName,
    url: config.appUrl,
    logo: `${config.appUrl}${config.appImage}`,
    description: config.appDescription,
    sameAs: [
      "https://twitter.com/scheddly",
      "https://linkedin.com/company/scheddly",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
    </>
  );
}
