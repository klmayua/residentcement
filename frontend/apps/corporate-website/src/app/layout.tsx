import type { Metadata } from "next";
import { Newsreader, Work_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "block",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: false,
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "block",
  weight: ["300", "400", "500", "600", "700"],
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Resident Ciment Bauchi Ltd | Built for Generations",
  description:
    "A leading producer of high-quality cement in Nigeria. State-of-the-art greenfield plant in Gwana, Bauchi State with 10 million metric tonnes annual capacity.",
  keywords:
    "cement, Nigeria, construction, building materials, cement manufacturing, Bauchi, Resident Ciment, Gwana, Alkaleri, limestone cement",
  authors: [{ name: "Resident Ciment Bauchi Ltd" }],
  openGraph: {
    title: "Resident Ciment Bauchi Ltd | Built for Generations",
    description:
      "A leading producer of high-quality cement in Nigeria with a world-class greenfield plant in Bauchi State.",
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
      <head>
        {/* Preconnect to Google Fonts for Material Symbols */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Material Symbols  loaded async so it never blocks render */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
          media="print"
          // @ts-expect-error onload is valid HTML but not in React types for link
          onLoad="this.media='all'"
        />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        </noscript>
      </head>
      <body className="antialiased selection:bg-primary-container selection:text-on-primary-container">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}


