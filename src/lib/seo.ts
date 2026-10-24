export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} · Momento` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · Momento` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
