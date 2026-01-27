import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GoogleAnalyticsWrapper from "./components/GoogleAnalyticsWrapper";
import { Analytics } from "@vercel/analytics/next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "MediMap | FHIR Terminology Service for ICD-11",
  description:
    "MediMap is a FHIR-powered terminology service bridging NAMASTE ↔ ICD-11. Discover seamless medical code mapping, search, and integration for healthcare data interoperability.",
  keywords: [
    "MediMap",
    "FHIR",
    "ICD-11",
    "Terminology Service",
    "Healthcare API",
    "Medical Coding",
    "NAMASTE Platform",
    "Health Data Interoperability",
  ],
  authors: [{ name: "MediMap Team" }],
  creator: "MediMap",
  publisher: "MediMap",
  metadataBase: new URL("https://medimap.com"), // replace with your actual domain
  alternates: {
    canonical: "https://medimap.com",
  },
  openGraph: {
    title: "MediMap | FHIR Terminology Service for ICD-11",
    description:
      "MediMap enables healthcare systems to integrate ICD-11 codes with FHIR for accurate terminology mapping and interoperability.",
    url: "https://medimap.com",
    siteName: "MediMap",
    images: [
      {
        url: "https://medimap.com/og-image.png", // replace with your OG image
        width: 1200,
        height: 630,
        alt: "MediMap FHIR Terminology Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediMap | FHIR Terminology Service for ICD-11",
    description:
      "MediMap makes healthcare data smarter with FHIR-powered ICD-11 terminology services.",
    creator: "@medimap", // replace with your Twitter/X handle
    images: ["https://medimap.com/og-image.png"], // replace
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased bg-gray-100 text-black overflow-x-hidden`}
      >
        <GoogleAnalyticsWrapper />
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
