import { Suspense } from 'react'
import PostList from './PostList'
import PostListSkeleton from './PostListSkeleton'

export const metadata = {
  title: 'Writing',
  description: 'A collection of my thoughts, articles, and inner journal.',
  alternates: {
    canonical: '/writing',
  },
}

export const revalidate = 3600 // ISR: Revalidate every hour

export default function WritingPage() {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-medium prose-a:font-normal mt-12 mb-24">
      <h1>Writing</h1>
      <p>Here is a collection of my public essays and my daily inner accounts.</p>
      
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  )
}
