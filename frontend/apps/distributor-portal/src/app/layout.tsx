import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Resident Cement Limited — Distributor Portal',
  description: 'Nigeria\'s trusted cement distribution and management platform',
  keywords: ['cement', 'distribution', 'enterprise', 'Nigeria', 'Resident Cement', 'Dangote', 'building materials'],
  authors: [{ name: 'Resident Cement Limited' }],
  creator: 'Resident Cement Limited',
  publisher: 'Resident Cement Limited',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Resident Cement Limited',
    description: 'Enterprise cement distribution platform',
    type: 'website',
    locale: 'en_NG',
    siteName: 'Resident Cement Limited',
    images: [
      {
        url: '/images/logo.png',
        width: 400,
        height: 200,
        alt: 'Resident Cement Limited Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Resident Cement Limited',
    description: 'Enterprise cement distribution platform',
    images: ['/images/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
