import type { Metadata } from "next";
import { Newsreader, Work_Sans } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Resident Cement | ERP Dashboard",
  description: "Enterprise Resource Planning Dashboard for Resident Cement",
  keywords: ["erp", "dashboard", "cement", "Nigeria", "Resident Cement", "industrial"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${newsreader.variable} ${workSans.variable}`}>
      <body className="antialiased bg-stone-950 text-white">
        {children}
      </body>
    </html>
  );
}
