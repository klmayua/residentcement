import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resident Cement | Admin Dashboard",
  description: "Administrative Dashboard for Resident Cement",
  keywords: ["admin", "dashboard", "cement", "Nigeria", "Resident Cement", "industrial"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#161311] text-[#e9e1dd]">
        {children}
      </body>
    </html>
  );
}
