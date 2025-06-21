import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://docsauraflow.com'),
  title: {
    default: "DocsAuraFlow - Free Online Document & Image Tools | PDF to Word, AI Upscaler, Resume Builder",
    template: "%s | DocsAuraFlow - Free Online Tools",
  },
  description: "DocsAuraFlow offers free online document and image processing tools. Convert PDF to Word, Word to PDF, enhance images with AI upscaler, remove backgrounds, create professional resumes, fill PDF forms, and more. No registration required.",
  keywords: [
    "DocsAuraFlow",
    "docsauraflow",
    "PDF to Word converter",
    "Word to PDF converter",
    "document converter",
    "image converter",
    "AI image upscaler",
    "background remover",
    "resume builder",
    "PDF form filler",
    "free online tools",
    "document processing",
    "image enhancement",
    "file conversion",
    "professional tools",
    "no registration",
    "online PDF tools",
    "image editing tools",
    "AI tools",
    "document suite",
    "PDF converter",
    "image upscaler",
    "background removal",
    "resume generator",
    "form filler",
    "free tools",
    "web tools",
    "document editing",
    "image processing",
    "file converter",
    "online converter",
    "PDF editor",
    "image editor",
    "AI enhancement",
    "document tools",
    "image tools",
    "conversion tools",
    "professional resume",
    "PDF forms",
    "online editor",
    "free converter",
    "document processing tools",
    "image processing tools",
    "AI-powered tools",
    "online utilities",
    "web applications",
    "document management",
    "image management",
    "file processing",
    "online services",
    "free services",
    "document conversion",
    "image conversion",
    "PDF processing",
    "image optimization",
    "document optimization",
    "online productivity tools",
    "business tools",
    "office tools",
    "document workflow",
    "image workflow",
    "file management",
    "online workspace",
    "digital tools",
    "productivity suite",
    "document suite",
    "image suite",
    "conversion suite",
    "online toolkit",
    "web toolkit",
    "document toolkit",
    "image toolkit",
    "free toolkit",
    "online toolkit",
    "web toolkit",
    "document toolkit",
    "image toolkit",
    "conversion toolkit",
    "processing toolkit",
    "editing toolkit",
    "enhancement toolkit",
    "optimization toolkit",
    "management toolkit",
    "workflow toolkit",
    "productivity toolkit",
    "business toolkit",
    "office toolkit",
    "digital toolkit"
  ],
  authors: [{ name: "DocsAuraFlow Team" }],
  creator: "DocsAuraFlow",
  publisher: "DocsAuraFlow",
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
    url: "https://docsauraflow.com",
    siteName: "DocsAuraFlow",
    title: "DocsAuraFlow - Free Online Document & Image Tools",
    description: "Free online document and image processing tools. Convert PDF to Word, enhance images with AI upscaler, remove backgrounds, create professional resumes, fill PDF forms, and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DocsAuraFlow - Free Online Document & Image Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DocsAuraFlow - Free Online Document & Image Tools",
    description: "Free online document and image processing tools. Convert PDF to Word, enhance images with AI upscaler, remove backgrounds, and more.",
    images: ["/og-image.jpg"],
    creator: "@docsauraflow",
  },
  alternates: {
    canonical: "https://docsauraflow.com",
  },
  category: "technology",
  classification: "Business Tools",
  other: {
    "google-site-verification": "your-google-verification-code",
    "msvalidate.01": "your-bing-verification-code",
    "yandex-verification": "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="description" content="DocsAuraFlow – Your intelligent document and image processing assistant. Free online tools for PDF conversion, AI image upscaling, background removal, resume building, and more." />
        <meta name="keywords" content="DocsAuraFlow, docsauraflow, PDF to Word, Word to PDF, AI upscaler, background remover, resume builder, free online tools, document converter, image converter" />
        <meta name="author" content="DocsAuraFlow" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DocsAuraFlow",
              "url": "https://docsauraflow.com",
              "logo": "https://docsauraflow.com/logo.png",
              "description": "Free online document and image processing tools",
              "sameAs": [
                "https://twitter.com/docsauraflow",
                "https://facebook.com/docsauraflow"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@docsauraflow.com"
              }
            })
          }}
        />

        {/* Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "DocsAuraFlow",
              "url": "https://docsauraflow.com",
              "description": "Free online document and image processing tools",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://docsauraflow.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* Structured Data for SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "DocsAuraFlow",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free online document and image processing tools including PDF to Word converter, AI image upscaler, background remover, resume builder, and more."
            })
          }}
        />
        
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

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
