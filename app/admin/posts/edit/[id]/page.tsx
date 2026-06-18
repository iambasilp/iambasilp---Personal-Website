'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '../../../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const postId = unwrappedParams.id

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error) {
        setError('Could not load post.')
        setFetching(false)
        return
      }

      setTitle(data.title || '')
      setSlug(data.slug || '')
      setContent(data.content || '')
      setExcerpt(data.excerpt || '')
      setStatus(data.status || 'draft')
      setFetching(false)
    }

    fetchPost()
  }, [postId])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const readingTime = Math.ceil(content.split(/\s+/).length / 200)

    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title,
        slug,
        content,
        excerpt,
        status,
        reading_time: readingTime,
        seo_title: title,
        seo_description: excerpt,
        published_at: status === 'published' ? new Date().toISOString() : null
      })
      .eq('id', postId)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/admin/posts')
    router.refresh()
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post forever?")) return
    
    setLoading(true)
    const { error } = await supabase.from('posts').delete().eq('id', postId)
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    
    router.push('/admin/posts')
    router.refresh()
  }

  if (fetching) return <div className="p-8 text-gray-500">Loading editor...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="text-gray-400 hover:text-[#2C2C2A] dark:hover:text-[#E4E3DF] transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-medium text-[#2C2C2A] dark:text-[#E4E3DF]">Edit Post</h1>
        </div>
        
        <button 
          onClick={handleDelete}
          type="button"
          className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
        >
          Delete Post
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <input
            type="text"
            placeholder="Post Title..."
            value={title}
            onChange={handleTitleChange}
            className="text-4xl font-medium bg-transparent focus:outline-none text-[#2C2C2A] dark:text-[#E4E3DF] placeholder-gray-300 dark:placeholder-zinc-700 w-full"
            required
          />
          <textarea
            placeholder="Write your markdown here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[500px] bg-transparent focus:outline-none resize-y text-[#2C2C2A] dark:text-[#E4E3DF] font-mono text-sm leading-relaxed placeholder-gray-300 dark:placeholder-zinc-700"
            required
          />
        </div>

        <div className="w-full md:w-72 flex flex-col gap-6 border-l border-[#E8E6E0] dark:border-zinc-800 pl-0 md:pl-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="bg-transparent border border-[#E8E6E0] dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 dark:focus:border-zinc-600 text-[#2C2C2A] dark:text-[#E4E3DF]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-transparent border border-[#E8E6E0] dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 dark:focus:border-zinc-600 text-[#2C2C2A] dark:text-[#E4E3DF]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="bg-transparent border border-[#E8E6E0] dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 dark:focus:border-zinc-600 resize-none h-24 text-[#2C2C2A] dark:text-[#E4E3DF]"
              placeholder="A brief summary for the homepage..."
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#2C2C2A] text-white dark:bg-[#E4E3DF] dark:text-[#20201F] px-4 py-3 rounded-lg font-medium hover:opacity-80 transition-opacity disabled:opacity-50 mt-4"
          >
            {loading ? 'Saving...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
