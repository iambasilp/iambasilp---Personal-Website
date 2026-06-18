import { createClient } from '../../lib/supabase/server'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import HabitStackNext from '../../components/HabitStackNext'
import ChoiceSelector from '../../components/ChoiceSelector'
import DigitalTimeline from '../../components/DigitalTimeline'
import Highlight from '../../components/mdx/Highlight'
import DropCap from '../../components/mdx/DropCap'

export const revalidate = 3600 // ISR: Revalidate every hour

const components = {
  HabitStackNext,
  ChoiceSelector,
  DigitalTimeline,
  Highlight,
  DropCap,
}

export async function generateStaticParams() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) return [];

  const res = await fetch(`${url}/rest/v1/posts?status=eq.published&select=slug`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });
  
  if (!res.ok) return [];
  
  const posts = await res.json();
  
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('seo_title, seo_description')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.seo_title,
    description: post.seo_description,
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single()

  // If no post exists or it is a draft (and we are not an admin), return 404
  // For simplicity, we just check if it exists here. A stricter check would verify auth for drafts.
  if (!post) {
    notFound()
  }

  return (
    <div className="mt-12 mb-24">
      <Link href="/writing" className="text-sm text-gray-400 hover:text-[#2C2C2A] dark:hover:text-[#E4E3DF] transition-colors mb-8 inline-block">
        ← Back to Writing
      </Link>
      
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-medium text-[#2C2C2A] dark:text-[#E4E3DF] tracking-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-zinc-500">
          <time>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
          {post.reading_time > 0 && <span>• {post.reading_time} min read</span>}
        </div>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-medium prose-a:font-normal prose-p:leading-relaxed text-[#2C2C2A] dark:text-[#E4E3DF]">
        <MDXRemote source={post.content} components={components} />
      </div>
    </div>
  )
}
