import type { Metadata } from "next";
import { Inter, Noto_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Resident Cement Company Limited | Built for Generations",
  description: "Nigeria's emerging cement manufacturing giant. Building a $500M world-class cement plant in Bauchi State with 10 million tonnes annual capacity.",
  keywords: "cement, Nigeria, construction, building materials, cement manufacturing, Bauchi, Resident Cement, Dr Abbas Waziri",
  authors: [{ name: "Resident Cement Company Limited" }],
  openGraph: {
    title: "Resident Cement Company Limited | Premium Cement Manufacturing",
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
    <html lang="en" className={`${inter.variable} ${notoSerif.variable} ${plusJakarta.variable}`}>
      <body className="antialiased selection:bg-primary-container/30 selection:text-foreground">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
