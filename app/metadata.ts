import type { Metadata } from "next";

const siteUrl = "https://www.sge.org.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Shree Ganesh Enterprises (SGE) | Fire, Plumbing, Electrical & AMC Solutions",
    template: "%s | Shree Ganesh Enterprises",
  },
  description:
    "Shree Ganesh Enterprises (SGE) delivers end-to-end fire protection, electrical, plumbing, IBMS, and e-security solutions since 1997.",
  keywords: [
    "Shree Ganesh Enterprises",
    "SGE",
    "fire protection systems",
    "fire fighting systems",
    "fire detection",
    "sprinkler systems",
    "hydrant systems",
    "IBMS",
    "e-security",
    "plumbing services",
    "electrical systems",
    "AMC services",
    "New Delhi",
    "India",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Shree Ganesh Enterprises",
    title:
      "Shree Ganesh Enterprises (SGE) | Fire, Plumbing, Electrical & AMC Solutions",
    description:
      "End-to-end fire protection, electrical, plumbing, IBMS, and e-security solutions since 1997.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Shree Ganesh Enterprises (SGE) | Fire, Plumbing, Electrical & AMC Solutions",
    description:
      "End-to-end fire protection, electrical, plumbing, IBMS, and e-security solutions since 1997.",
  },
  robots: {
    index: true,
    follow: true,
  },
};
