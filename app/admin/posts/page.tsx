import { createClient } from '../../lib/supabase/server'
import Link from 'next/link'


export default async function AdminPosts() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium text-[#2C2C2A] dark:text-[#E4E3DF]">Posts</h1>
        <Link 
          href="/admin/posts/new"
          className="bg-[#2C2C2A] text-white dark:bg-[#E4E3DF] dark:text-[#20201F] px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity text-sm"
        >
          New Post
        </Link>
      </div>

      <div className="border border-[#E8E6E0] dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F7F5F0] dark:bg-zinc-900/50 border-b border-[#E8E6E0] dark:border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E6E0] dark:divide-zinc-800">
            {posts?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No posts written yet. Start your first essay!
                </td>
              </tr>
            ) : (
              posts?.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#2C2C2A] dark:text-[#E4E3DF]">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <Link href={`/admin/posts/edit/${post.id}`} className="text-gray-400 hover:text-[#2C2C2A] dark:hover:text-[#E4E3DF] transition-colors">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
