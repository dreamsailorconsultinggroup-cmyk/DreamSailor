import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthProvider";

const CANONICAL_DOMAIN = "https://www.dsailorgroup.com.au";

// Static metadata
export const metadata: Metadata = {
  title:
    "Dream Sailor Consulting Pty Ltd - Empowering Dreams, Creating Opportunities",
  description:
    "Your trusted partner in real estate, recruitment, education, and migration services.",
  metadataBase: new URL(CANONICAL_DOMAIN),
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// Revalidate caches every hour
export const revalidate = 3600;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href={CANONICAL_DOMAIN} />

        {/* Favicon / Apple Touch Icon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
      </head>

      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} min-h-screen flex flex-col`}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-screen">
              <div className="animate-pulse text-lg">Loading...</div>
            </div>
          }
        >
          <AuthProvider>{children}</AuthProvider>
        </Suspense>

        <Analytics />
      </body>
    </html>
  );
}
