'use client';

import Link from 'next/link';

interface HabitStackNextProps {
  nextTitle: string;
  nextHref: string;
}

export default function HabitStackNext({ nextTitle, nextHref }: HabitStackNextProps) {
  return (
    <div className="mt-24 mb-12 pt-12 flex justify-end">
      <Link 
        href={nextHref} 
        title={nextTitle}
        className="group flex items-center gap-4 text-gray-400 hover:text-[#2C2C2A] dark:text-zinc-600 dark:hover:text-[#E4E3DF] transition-colors duration-300"
      >
        <span className="text-xs font-sans tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Next
        </span>
        <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 dark:border-zinc-800 group-hover:border-[#2C2C2A] dark:group-hover:border-[#E4E3DF] transition-colors duration-300">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform duration-300">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </Link>
    </div>
  );
}
