import { Suspense } from 'react'
import SalahTrackerServer from '../components/SalahTrackerServer'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Keystone Habit | Basil Pulikuth',
  description: 'Tracking the 5 daily compulsory prayers (Salah) as the foundational keystone habit for building momentum and discipline.',
  openGraph: {
    title: 'Keystone Habit Tracker | Basil Pulikuth',
    description: 'A dedicated tracker for the 5 daily compulsory prayers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keystone Habit | Basil Pulikuth',
    description: 'Tracking the 5 daily compulsory prayers (Salah).',
  }
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function KeystonePage(props: Props) {
  const searchParams = await props.searchParams;
  const now = new Date();
  
  const yearParam = searchParams?.year;
  const monthParam = searchParams?.month;

  const year = yearParam ? parseInt(yearParam as string, 10) : now.getFullYear();
  const month = monthParam ? parseInt(monthParam as string, 10) : now.getMonth();

  const safeYear = isNaN(year) ? now.getFullYear() : year;
  const safeMonth = isNaN(month) || month < 0 || month > 11 ? now.getMonth() : month;

  return (
    <article className="mt-12 mb-24 animate-content-fade">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl sm:text-4xl font-medium text-[#2C2C2A] dark:text-[#E4E3DF] tracking-tight">
            Keystone Habit
          </h1>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-zinc-100 dark:bg-[#1A1A1A] text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Official Start: 20 Jun 2026
          </span>
        </div>
        
        <p className="text-gray-500 dark:text-zinc-400 max-w-2xl mb-8">
          Tracking the 5 daily compulsory prayers (Salah) as the foundation for all other habits.
        </p>

        {/* Identity Level Commitment */}
        <div className="p-6 bg-white dark:bg-[#151515] border border-zinc-200 dark:border-zinc-800 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-900 dark:bg-zinc-500"></div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold mb-2 block">Identity Architecture</span>
          <p className="text-lg md:text-xl font-serif text-[#2C2C2A] dark:text-[#E4E3DF] italic">
            "I am the type of person who does what is required right now."
          </p>
        </div>
      </header>

      <Suspense fallback={<TrackerSkeleton />}>
        <SalahTrackerServer year={safeYear} month={safeMonth} />
      </Suspense>
    </article>
  )
}

function TrackerSkeleton() {
  return (
    <div className="animate-content-fade">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800/80 rounded-lg mb-2 animate-pulse"></div>
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800/80 rounded animate-pulse"></div>
        </div>
        <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800/80 rounded-full self-start sm:self-auto animate-pulse"></div>
      </div>

      {/* Analytics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 h-32 animate-pulse"></div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 31 }).map((_, i) => (
          <div key={i} className="flex flex-col bg-white dark:bg-[#1A1A1A] rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 h-[104px] animate-pulse">
            <div className="flex justify-between items-baseline mb-4">
              <div className="h-6 w-6 bg-zinc-200 dark:bg-zinc-800/80 rounded"></div>
              <div className="h-4 w-8 bg-zinc-200 dark:bg-zinc-800/80 rounded"></div>
            </div>
            <div className="flex justify-between mt-auto">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-[22px] w-[22px] sm:h-6 sm:w-6 bg-zinc-200 dark:bg-zinc-800/80 rounded-md"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
