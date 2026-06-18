export default function PostListSkeleton() {
  return (
    <ul className="mt-12 flex flex-col gap-6 not-prose" aria-hidden="true" role="list" aria-busy="true" aria-live="polite">
      {[...Array(5)].map((_, i) => (
        <li key={i} className="flex flex-col gap-1 -ml-2 p-2">
          <div 
            className="h-7 bg-zinc-200/80 dark:bg-zinc-800/60 rounded-md w-2/3 md:w-1/2 animate-pulse" 
            style={{ animationDelay: `${i * 150}ms`, animationDuration: '2s' }}
          ></div>
          <div className="flex items-center gap-4">
            <div 
              className="h-5 bg-zinc-100 dark:bg-zinc-800/40 rounded-md w-24 animate-pulse" 
              style={{ animationDelay: `${i * 150 + 50}ms`, animationDuration: '2s' }}
            ></div>
            <div 
              className="h-5 bg-zinc-100 dark:bg-zinc-800/40 rounded-md w-16 animate-pulse" 
              style={{ animationDelay: `${i * 150 + 100}ms`, animationDuration: '2s' }}
            ></div>
          </div>
        </li>
      ))}
    </ul>
  )
}
