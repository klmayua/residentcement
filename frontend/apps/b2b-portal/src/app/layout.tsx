import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resident Ciment Bauchi Ltd | B2B Portal",
  description:
    "Partner portal for Resident Ciment Bauchi Ltd: catalog, orders, invoices, and account operations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

