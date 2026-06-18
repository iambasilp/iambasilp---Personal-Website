import './globals.css';
import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import Link from 'next/link';
import ReadingEnhancers from './components/ReadingEnhancers';
import ClickSound from './components/ClickSound';
import AmbientDepth from './components/AmbientDepth';
import AttentionMilestone from './components/AttentionMilestone';
import Header from './components/Header';
import AnalyticsTracker from './components/analytics/AnalyticsTracker';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const lora = Lora({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  metadataBase: new URL('https://iambasilp.vercel.app'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Basil Pulikuth',
    template: '%s | Basil Pulikuth'
  },
  description: 'My portfolio, blog, and personal website.',
  icons: {
    icon: 'data:,'
  },
  openGraph: {
    title: 'Basil Pulikuth',
    description: 'My portfolio, blog, and personal website.',
    url: 'https://iambasilp.vercel.app',
    siteName: 'Basil Pulikuth',
    images: [
      {
        url: '/og-image.png', // Fallback OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Basil Pulikuth',
    description: 'My portfolio, blog, and personal website.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className="antialiased tracking-tight bg-[#F7F5F0] dark:bg-[#1A1A19] relative z-0">
        <AnalyticsTracker />
        <AmbientDepth />
        <AttentionMilestone />
        <div className="min-h-screen flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 text-[#2C2C2A] dark:text-[#E4E3DF]">
          <main className="max-w-2xl md:max-w-3xl mx-auto w-full flex-1 flex flex-col justify-between">
            <div>
              <Header />
              <ReadingEnhancers />
              <div className="space-y-8" style={{ fontSize: 'calc(1rem * var(--font-scale))', transition: 'font-size 0.3s ease-out' }}>
                {children}
              </div>
            </div>
          </main>
          <ClickSound />
        </div>
      </body>
    </html>
  );
}


