import { createClient } from '../lib/supabase/server'
import Link from 'next/link'

export default async function PostList() {
  const supabase = await createClient()

  // Fetch only published posts
  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, created_at, reading_time')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <ul className="mt-12 flex flex-col gap-6 not-prose animate-content-fade" role="list">
      {posts?.length === 0 ? (
        <p className="text-gray-500">No posts published yet.</p>
      ) : (
        posts?.map((post) => (
          <li key={post.slug}>
            <Link 
              href={`/writing/${post.slug}`}
              prefetch={true}
              className="group flex flex-col gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 rounded-md -ml-2 p-2 transition-all"
              aria-label={`Read post: ${post.title}`}
            >
              <h3 className="text-lg font-medium text-[#2C2C2A] dark:text-[#E4E3DF] group-hover:opacity-70 transition-opacity">
                {post.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-zinc-500">
                <time dateTime={new Date(post.created_at).toISOString()}>
                  {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
                {post.reading_time > 0 && <span aria-label={`${post.reading_time} minute read`}>• {post.reading_time} min read</span>}
              </div>
            </Link>
          </li>
        ))
      )}
    </ul>
  )
}
