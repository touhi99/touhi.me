import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.touhi.me/" },
    { url: "https://www.touhi.me/cv" },
  ];
}
