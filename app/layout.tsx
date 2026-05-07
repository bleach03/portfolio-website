import type { Metadata } from 'next';
import './globals.css';
import './scrapbook.css';
import { Filters } from './components/Filters';

export const metadata: Metadata = {
  title: 'ethan miller',
  description: 'portfolio of ethan miller — coder, musician, game developer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Filters />
        {children}
      </body>
    </html>
  );
}
