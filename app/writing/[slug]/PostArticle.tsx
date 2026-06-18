import { createClient } from '../../lib/supabase/server'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import HabitStackNext from '../../components/HabitStackNext'
import ChoiceSelector from '../../components/ChoiceSelector'
import DigitalTimeline from '../../components/DigitalTimeline'
import Highlight from '../../components/mdx/Highlight'
import DropCap from '../../components/mdx/DropCap'

const components = {
  HabitStackNext,
  ChoiceSelector,
  DigitalTimeline,
  Highlight,
  DropCap,
}

export default async function PostArticle({ slug }: { slug: string }) {
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <div className="animate-content-fade">
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-medium text-[#2C2C2A] dark:text-[#E4E3DF] tracking-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-zinc-500">
          <time dateTime={new Date(post.created_at).toISOString()}>
            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
          {post.reading_time > 0 && <span aria-label={`Estimated reading time: ${post.reading_time} minutes`}>• {post.reading_time} min read</span>}
        </div>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-medium prose-a:font-normal prose-p:leading-relaxed text-[#2C2C2A] dark:text-[#E4E3DF]">
        <MDXRemote source={post.content} components={components} />
      </div>
    </div>
  )
}
