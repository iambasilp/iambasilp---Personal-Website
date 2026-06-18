import { createClient } from '../lib/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'Writing',
  description: 'A collection of my thoughts, articles, and inner journal.',
  alternates: {
    canonical: '/writing',
  },
}

export const revalidate = 3600 // ISR: Revalidate every hour

export default async function WritingPage() {
  const supabase = await createClient()

  // Fetch only published posts
  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, created_at, reading_time')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-medium prose-a:font-normal mt-12 mb-24">
      <h1>Writing</h1>
      <p>Here is a collection of my public essays and my daily inner accounts.</p>

      <div className="mt-12 flex flex-col gap-6 not-prose">
        {posts?.length === 0 ? (
          <p className="text-gray-500">No posts published yet.</p>
        ) : (
          posts?.map((post) => (
            <Link 
              key={post.slug} 
              href={`/writing/${post.slug}`}
              className="group flex flex-col gap-1"
            >
              <h3 className="text-lg font-medium text-[#2C2C2A] dark:text-[#E4E3DF] group-hover:opacity-70 transition-opacity">
                {post.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-zinc-500">
                <time>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                {post.reading_time > 0 && <span>• {post.reading_time} min read</span>}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
