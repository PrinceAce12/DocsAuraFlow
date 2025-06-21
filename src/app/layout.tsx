import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Document & Image Suite - Free Online Tools",
    template: "%s | Document & Image Suite",
  },
  description: "Free online document and image processing tools. Convert PDF to Word, Word to PDF, enhance images with AI, remove backgrounds, create professional resumes, and more. No registration required.",
  keywords: [
    "PDF to Word converter",
    "Word to PDF",
    "document converter",
    "image converter",
    "AI upscaler",
    "background remover",
    "resume builder",
    "PDF form filler",
    "free online tools",
    "document processing",
    "image enhancement",
    "file conversion",
    "professional tools",
    "no registration",
  ],
  authors: [{ name: "Document & Image Suite" }],
  creator: "Document & Image Suite",
  publisher: "Document & Image Suite",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://documentsuite.com",
    siteName: "Document & Image Suite",
    title: "Document & Image Suite - Free Online Tools",
    description: "Free online document and image processing tools. Convert PDF to Word, enhance images with AI, remove backgrounds, create professional resumes, and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Document & Image Suite - Free Online Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Document & Image Suite - Free Online Tools",
    description: "Free online document and image processing tools. Convert PDF to Word, enhance images with AI, remove backgrounds, and more.",
    images: ["/og-image.jpg"],
    creator: "@documentsuite",
  },
  alternates: {
    canonical: "https://documentsuite.com",
  },
  category: "technology",
  classification: "Business Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3383149380786147"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script id="adsense-init" strategy="afterInteractive">
          {`
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-3383149380786147",
              enable_page_level_ads: true
            });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
