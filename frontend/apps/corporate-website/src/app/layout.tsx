import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Resident Cement Company Limited | Premium Cement Manufacturing",
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
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
