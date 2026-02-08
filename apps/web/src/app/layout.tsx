import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Kroma - AI Image Editor",
    template: "%s | Kroma",
  },
  description: "Remove backgrounds and edit images instantly with AI.",
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kroma - AI Image Editor",
    description: "Remove backgrounds and edit images instantly with AI.",
    url: APP_URL,
    siteName: "Kroma",
    locale: "en_US", // or pt_BR if you plan to internationalize
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kroma - AI Image Editor",
    description: "Remove backgrounds and edit images instantly with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
