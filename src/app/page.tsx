import type { Viewport } from "next";

import { AscentScene } from "@/components/ascent/scene";
import { buildGraph } from "@/components/ascent/graph";
import { RESUME_DATA } from "@/data/resume-data";

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#08080c",
  viewportFit: "cover",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: RESUME_DATA.name,
  jobTitle: RESUME_DATA.role,
  description: RESUME_DATA.specialties,
  url: RESUME_DATA.personalWebsiteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Munich",
    addressCountry: "DE",
  },
  worksFor: {
    "@type": "Organization",
    name: RESUME_DATA.company,
    url: "https://www.deepset.ai",
  },
  sameAs: RESUME_DATA.contact.social.map((social) => social.url),
  alumniOf: RESUME_DATA.education.map((education) => ({
    "@type": "CollegeOrUniversity",
    name: education.school,
  })),
  knowsAbout: RESUME_DATA.skillGroups.flatMap((group) => group.skills),
};

export default function Page() {
  const graph = buildGraph(RESUME_DATA);
  const profile = {
    name: RESUME_DATA.name,
    role: `${RESUME_DATA.role} at ${RESUME_DATA.company}`,
    place: `${RESUME_DATA.location.split(",")[0]} · ${RESUME_DATA.timezone}`,
    avatar: RESUME_DATA.avatarUrl,
    summary:
      "I help enterprise teams design, build, and ship production-grade Generative AI applications on the Haystack Enterprise Platform.",
    social: RESUME_DATA.contact.social.map((s) => ({
      name: s.name,
      url: s.url,
    })),
    emailEnc: Buffer.from(RESUME_DATA.contact.email).toString("base64"),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <AscentScene graph={graph} profile={profile} />
    </>
  );
}
