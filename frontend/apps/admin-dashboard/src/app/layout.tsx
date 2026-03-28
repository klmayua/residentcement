import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Resident Ciment Bauchi Ltd | ERP Dashboard",
  description: "ERP and operational dashboard for Resident Ciment Bauchi Ltd",
  keywords: ["admin", "dashboard", "cement", "Nigeria", "Resident Ciment Bauchi Ltd", "industrial", "erp"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#161311] text-[#e9e1dd]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
