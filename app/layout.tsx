import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import './globals.css';
import './scrapbook.css';
import { Filters } from './components/Filters';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

const DESCRIPTION =
  'portfolio of ethan miller — coder, musician, game developer.';

export const metadata: Metadata = {
  metadataBase: new URL('https://ethanmiller.xyz'),
  title: 'ethan miller',
  description: DESCRIPTION,
  openGraph: {
    title: 'ethan miller',
    description: DESCRIPTION,
    url: 'https://ethanmiller.xyz',
    siteName: 'ethan miller',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body>
        <Filters />
        {children}
      </body>
    </html>
  );
}
