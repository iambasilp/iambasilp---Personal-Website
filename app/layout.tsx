import './globals.css';
import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import ReadingEnhancers from './components/ReadingEnhancers';

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
      <body className="antialiased tracking-tight">
        <div className="min-h-screen flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 dark:bg-zinc-950 bg-white text-gray-900 dark:text-zinc-200">
          <main className="max-w-2xl md:max-w-3xl mx-auto w-full flex-1 flex flex-col justify-between">
            <div>
              <Header />
              <ReadingEnhancers />
              <div className="space-y-8" style={{ fontSize: 'calc(1rem * var(--font-scale))', transition: 'font-size 0.3s ease-out' }}>
                {children}
              </div>
            </div>
            <Footer />
          </main>
          <Analytics />
        </div>
      </body>
    </html>
  );
}


function Footer() {
  const links = [

    { name: 'email', url: 'mailto:iambasilp@gmail.com' },

  ];

  return (
    <footer className="mt-12 pt-6 border-t border-gray-100 dark:border-zinc-800 text-center">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 tracking-tight">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200"
          >
            {link.name}
          </a>
        ))}
      </div>
    </footer>
  );
}

function Header() {
  return (
    <header className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100 dark:border-zinc-800">
      <Link href="/" className="font-semibold text-lg hover:text-blue-500 transition-colors tracking-tight">
        Basil Pulikuth
      </Link>
      <nav className="flex space-x-6 text-sm font-medium text-gray-600 dark:text-zinc-400">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
          Home
        </Link>
        <Link href="/writing" className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
          Writing
        </Link>
      </nav>
    </header>
  );
}
