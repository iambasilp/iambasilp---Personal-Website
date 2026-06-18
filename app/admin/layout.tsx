import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 mb-24">
      <header className="flex justify-between items-center pb-6 border-b border-[#E8E6E0] dark:border-zinc-800 mb-12">
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/admin" className="text-[#2C2C2A] dark:text-[#E4E3DF] hover:opacity-70 transition-opacity">
            Admin Dashboard
          </Link>
          <Link href="/admin/posts" className="text-gray-500 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors">
            Posts
          </Link>
        </div>
        <Link 
          href="/" 
          target="_blank"
          className="text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
        >
          View Live Site →
        </Link>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}
