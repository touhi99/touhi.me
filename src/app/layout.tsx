import { Analytics } from "@vercel/analytics/react";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import React from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import type { Metadata, Viewport } from "next";
import { RESUME_DATA } from "@/data/resume-data";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const title = `${RESUME_DATA.name} — ${RESUME_DATA.role}, ${RESUME_DATA.specialties}`;
const description =
  "Senior Solution Engineer at deepset working hands-on with enterprise customers as a forward deployed engineer on the Haystack Enterprise Platform — designing, building, and shipping production-grade Generative AI applications.";

export const metadata: Metadata = {
  metadataBase: new URL("https://touhi.me"),
  title,
  description,
  applicationName: RESUME_DATA.name,
  authors: [{ name: RESUME_DATA.name, url: "https://touhi.me" }],
  creator: RESUME_DATA.name,
  keywords: [
    "Touhidul Alam",
    "GenAI",
    "NLP",
    "LLM",
    "RAG",
    "Haystack",
    "deepset",
    "Solution Engineer",
    "Forward Deployed Engineer",
    "Munich",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "https://touhi.me",
    siteName: RESUME_DATA.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
