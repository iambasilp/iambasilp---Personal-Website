'use client'

import { useState } from 'react'
import { createClient } from '../../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewPost() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    // Only auto-update slug if they haven't manually typed one
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Calculate rough reading time (words / 200 wpm)
    const readingTime = Math.ceil(content.split(/\s+/).length / 200)

    const { error: insertError } = await supabase
      .from('posts')
      .insert({
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

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/admin/posts')
    router.refresh()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/posts" className="text-gray-400 hover:text-[#2C2C2A] dark:hover:text-[#E4E3DF] transition-colors">
          ← Back
        </Link>
        <h1 className="text-2xl font-medium text-[#2C2C2A] dark:text-[#E4E3DF]">Write New Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
        
        {/* Editor Side */}
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
            placeholder="Write your markdown here... Use ## for headers, * for italics, and [text](link) for links."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[500px] bg-transparent focus:outline-none resize-y text-[#2C2C2A] dark:text-[#E4E3DF] font-mono text-sm leading-relaxed placeholder-gray-300 dark:placeholder-zinc-700"
            required
          />
        </div>

        {/* Settings Side */}
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
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Excerpt / SEO Description</label>
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
            {loading ? 'Saving...' : `Save ${status === 'published' ? '& Publish' : 'as Draft'}`}
          </button>
        </div>

      </form>
    </div>
  )
}
