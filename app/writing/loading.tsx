export default function Loading() {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-medium prose-a:font-normal mt-12 mb-24">
      <h1>Writing</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Here is a collection of my public essays and my daily inner accounts.</p>

      <div className="mt-12 flex flex-col gap-8 not-prose">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div 
              className="h-[26px] bg-zinc-200/80 dark:bg-zinc-800/60 rounded-md w-2/3 md:w-1/2 animate-pulse" 
              style={{ animationDelay: `${i * 150}ms`, animationDuration: '2s' }}
            ></div>
            <div className="flex items-center gap-4">
              <div 
                className="h-[18px] bg-zinc-100 dark:bg-zinc-800/40 rounded-md w-24 animate-pulse" 
                style={{ animationDelay: `${i * 150 + 50}ms`, animationDuration: '2s' }}
              ></div>
              <div 
                className="h-[18px] bg-zinc-100 dark:bg-zinc-800/40 rounded-md w-16 animate-pulse" 
                style={{ animationDelay: `${i * 150 + 100}ms`, animationDuration: '2s' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
