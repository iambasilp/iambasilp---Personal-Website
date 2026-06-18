export default function Loading() {
  return (
    <div className="mt-12 mb-24">
      <div className="text-sm text-zinc-400 mb-8 inline-block">
        ← Back to Writing
      </div>
      
      <header className="mb-14">
        <div className="h-10 bg-zinc-200/80 dark:bg-zinc-800/60 rounded-lg w-3/4 sm:w-2/3 mb-6 animate-pulse" style={{ animationDuration: '2s' }}></div>
        <div className="flex items-center gap-4">
          <div className="h-5 bg-zinc-100 dark:bg-zinc-800/40 rounded-md w-32 animate-pulse" style={{ animationDelay: '100ms', animationDuration: '2s' }}></div>
          <div className="h-5 bg-zinc-100 dark:bg-zinc-800/40 rounded-md w-24 animate-pulse" style={{ animationDelay: '200ms', animationDuration: '2s' }}></div>
        </div>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4 mb-12">
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800/40 rounded-md w-full animate-pulse" style={{ animationDelay: `${i * 150}ms`, animationDuration: '2s' }}></div>
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800/40 rounded-md w-full animate-pulse" style={{ animationDelay: `${i * 150 + 50}ms`, animationDuration: '2s' }}></div>
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800/40 rounded-md w-11/12 animate-pulse" style={{ animationDelay: `${i * 150 + 100}ms`, animationDuration: '2s' }}></div>
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800/40 rounded-md w-4/5 animate-pulse" style={{ animationDelay: `${i * 150 + 150}ms`, animationDuration: '2s' }}></div>
          </div>
        ))}
      </div>
    </div>
  )
}
