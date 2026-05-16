import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import "./globals.css";

const bitcountSingle = localFont({
  src: "../fonts/bitcount-single-latin.woff2",
  variable: "--font-bitcount-single",
  display: "swap",
  weight: "400",
  preload: false,
});

const datatype = localFont({
  src: "../fonts/datatype-latin.woff2",
  variable: "--font-datatype",
  display: "swap",
  weight: "400",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Axel's Boilerplate — Your tagline here",
    template: "%s | Axel's Boilerplate",
  },
  description:
    "Animated SaaS landing page boilerplate. Replace this description with your own product copy — what you build, who it's for, why it matters.",
  keywords: ["axel", "boilerplate", "saas", "landing"],
  authors: [{ name: "Axel" }],
  creator: "Axel",
  metadataBase: new URL("https://yourdomain.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "Axel's Boilerplate",
    title: "Axel's Boilerplate — Your tagline here",
    description: "Animated SaaS landing page boilerplate.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axel's Boilerplate — Your tagline here",
    description: "Animated SaaS landing page boilerplate.",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${bitcountSingle.variable} ${datatype.variable} antialiased`}
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
