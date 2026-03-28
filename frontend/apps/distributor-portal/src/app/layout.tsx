import type { Metadata } from 'next';
import { Inter, Noto_Serif, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/app/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Resident Cement | Distributor Portal',
  description: 'Nigeria\'s trusted cement distribution and management platform - Premium Access',
  keywords: ['cement', 'distribution', 'enterprise', 'Nigeria', 'Resident Cement', 'building materials', 'Bauchi', 'manufacturing'],
  authors: [{ name: 'Resident Cement Bachi Ltd' }],
  creator: 'Resident Cement Bachi Ltd',
  publisher: 'Resident Cement Bachi Ltd',
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Resident Cement | Distributor Portal',
    description: 'Enterprise cement distribution platform',
    type: 'website',
    locale: 'en_NG',
    siteName: 'Resident Cement',
    images: [
      {
        url: '/images/logo.png',
        width: 400,
        height: 200,
        alt: 'Resident Cement Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Resident Cement | Distributor Portal',
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
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${notoSerif.variable} ${plusJakarta.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
