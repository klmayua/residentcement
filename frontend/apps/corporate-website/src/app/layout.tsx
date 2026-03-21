import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "ResidentCement | Premium Cement Solutions for Nigeria",
  description: "Nigeria's leading cement distribution platform. Quality products, reliable delivery, and innovative solutions for construction professionals.",
  keywords: "cement, Nigeria, construction, Dangote, building materials, cement distribution",
  authors: [{ name: "ResidentCement" }],
  openGraph: {
    title: "ResidentCement | Premium Cement Solutions",
    description: "Quality cement products for Nigeria's construction industry",
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
