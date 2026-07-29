import type { Metadata, Viewport } from "next";
import { bigShoulders, bigShouldersStencil, inter } from "@/lib/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { RolePicker } from "@/components/onboarding/RolePicker";
import { CompareBar } from "@/components/browse/CompareBar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { BackNav } from "@/components/layout/BackNav";
import { BackToTop } from "@/components/layout/BackToTop";
import { PwaInstallBanner } from "@/components/layout/PwaInstallBanner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: "Crossface | New Jersey's Home for Wrestling",
  description:
    "Crossface is the recruiting platform built for New Jersey and East Coast wrestling — auto-tagged match film, real stats, and head-to-head scouting for every wrestler.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/logo-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/logo-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/logo-apple-touch.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${bigShouldersStencil.variable} ${inter.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-navy-900">
        <Providers>
          <Navbar />
          <BackNav />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <CompareBar />
          <MobileBottomNav />
        </Providers>
        <ServiceWorkerRegister />
        <PageViewTracker />
        <RolePicker />
        <BackToTop />
        <PwaInstallBanner />
      </body>
    </html>
  );
}
