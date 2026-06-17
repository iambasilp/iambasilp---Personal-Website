import './globals.css';
import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import ReadingEnhancers from './components/ReadingEnhancers';
import ClickSound from './components/ClickSound';
import AmbientDepth from './components/AmbientDepth';
import AttentionMilestone from './components/AttentionMilestone';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const lora = Lora({ subsets: ['latin'], variable: '--font-serif' });
// helo

export const metadata: Metadata = {
  metadataBase: new URL('https://iambasilp.vercel.app'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Basil Pulikuth',
    template: '%s | Basil Pulikuth'
  },
  description: 'My portfolio, blog, and personal website.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className="antialiased tracking-tight bg-[#F7F5F0] dark:bg-[#1A1A19] relative z-0">
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
          <Analytics />
        </div>
      </body>
    </html>
  );
}


function Header() {
  return (
    <header className="flex justify-between items-start mb-10 pb-4 border-b border-[#E8E6E0] dark:border-zinc-800">
      <div>
        <Link href="/" className="font-semibold text-lg hover:text-gray-600 dark:hover:text-zinc-400 transition-colors tracking-tight block">
          Basil Pulikuth
        </Link>
      </div>
      <nav className="flex space-x-6 text-sm font-medium text-gray-600 dark:text-zinc-400 pt-1">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
          Home
        </Link>
        <Link href="/writing" className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
          Writing
        </Link>
        <div className="relative group">
          <button className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1 pb-4 -mb-4">
            Connect
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="h-4 w-4 opacity-70 group-hover:rotate-180 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>
          </button>
          <div className="absolute right-0 top-full mt-2 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 bg-white dark:bg-[#20201F] border border-gray-100 dark:border-zinc-800 shadow-xl rounded-xl p-1.5 flex flex-col z-50">
            <a href="mailto:iambasilp@gmail.com" className="px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100 rounded-lg transition-colors">
              Email
            </a>
            <a href="https://wa.me/918848344415?text=Hey%20Basil!%20I%20was%20just%20reading%20your%20site%20and%20wanted%20to%20say%20hello.%20%E2%9C%A8" target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100 rounded-lg transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
