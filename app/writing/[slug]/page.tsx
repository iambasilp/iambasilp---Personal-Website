import { createClient } from '../../lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import PostArticle from './PostArticle'
import PostSkeleton from './PostSkeleton'

export const revalidate = 3600 // ISR: Revalidate every hour

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
    .select('seo_title, seo_description, created_at, updated_at')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.seo_title,
    description: post.seo_description,
    openGraph: {
      title: post.seo_title,
      description: post.seo_description,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title,
      description: post.seo_description,
    }
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  return (
    <article className="mt-12 mb-24">
      <Link href="/writing" prefetch={true} className="text-sm text-gray-400 hover:text-[#2C2C2A] dark:hover:text-[#E4E3DF] transition-colors mb-8 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 rounded-md -ml-2 p-2" aria-label="Go back to the writing page">
        ← Back to Writing
      </Link>
      
      <Suspense fallback={<PostSkeleton />}>
        <PostArticle slug={resolvedParams.slug} />
      </Suspense>
    </article>
  )
}
