import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Smoothspec - PC Upgrade Advisor",
    template: "%s | Smoothspec",
  },
  description:
    "Find the best PC component upgrades for your favorite games. Get personalized recommendations based on your current build, games, and budget.",
  keywords: [
    "PC upgrade",
    "gaming PC",
    "GPU upgrade",
    "CPU upgrade",
    "bottleneck calculator",
    "PC build advisor",
    "gaming performance",
    "hardware recommendations",
  ],
  authors: [{ name: "Smoothspec" }],
  creator: "Smoothspec",
  publisher: "Smoothspec",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Smoothspec",
    title: "Smoothspec - PC Upgrade Advisor",
    description:
      "Find the best PC component upgrades for your favorite games. Get personalized recommendations based on your current build, games, and budget.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smoothspec - PC Upgrade Advisor",
    description:
      "Find the best PC component upgrades for your favorite games. Get personalized recommendations based on your current build.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://smoothspec.com"
  ),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
