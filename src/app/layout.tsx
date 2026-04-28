import type { Metadata } from 'next';
import '@/styles/globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'JMPro — HNI Wealth Platform',
  description: '360° view of all your holdings with live tax intelligence and AI advisor.',
  themeColor: '#1F3189',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Barlow+Semi+Condensed:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
