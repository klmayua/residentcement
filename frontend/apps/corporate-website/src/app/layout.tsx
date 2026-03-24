import type { Metadata } from "next";
import { Newsreader, Work_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Newsreader - The Curator (serif for headlines)
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

// Work Sans - Industrial foundation (sans-serif for body)
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "RESIDENT CEMENT | Building Nigeria's Industrial Future",
  description: "Nigeria's emerging cement manufacturing giant. Building a $500M world-class cement plant in Bauchi State with 10 million tonnes annual capacity.",
  keywords: "cement, Nigeria, construction, building materials, cement manufacturing, Bauchi, Resident Cement",
  authors: [{ name: "Resident Cement Company Limited" }],
  openGraph: {
    title: "RESIDENT CEMENT | Building Nigeria's Industrial Future",
    description: "Nigeria's emerging cement manufacturing giant with world-class production facility",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${workSans.variable}`}>
      <body className="antialiased selection:bg-secondary selection:text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
