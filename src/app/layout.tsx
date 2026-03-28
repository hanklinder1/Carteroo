import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Carteroo — Buy & Sell Golf Carts in Florida",
    template: "%s | Carteroo",
  },
  description:
    "Florida's #1 golf cart marketplace. Browse thousands of listings from private sellers and verified dealers. Find electric and gas golf carts near you.",
  keywords: ["golf cart", "golf cart for sale", "buy golf cart", "sell golf cart", "Florida golf cart", "used golf cart", "electric golf cart"],
  metadataBase: new URL("https://carteroo.com"),
  openGraph: {
    type: "website",
    siteName: "Carteroo",
    title: "Carteroo — Buy & Sell Golf Carts in Florida",
    description: "Florida's #1 golf cart marketplace. Browse listings from private sellers and verified dealers.",
    url: "https://carteroo.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carteroo — Buy & Sell Golf Carts in Florida",
    description: "Florida's #1 golf cart marketplace. Browse listings from private sellers and verified dealers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
