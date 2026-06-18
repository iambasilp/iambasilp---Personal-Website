import { createClient } from '../lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: postCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })

  const { count: viewCount } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })

  return (
    <div>
      <h1 className="text-2xl font-medium mb-8 text-[#2C2C2A] dark:text-[#E4E3DF]">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#E8E6E0] dark:border-zinc-800 p-6 rounded-xl bg-[#F7F5F0] dark:bg-zinc-900/50">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Posts</h3>
          <p className="text-4xl font-semibold">{postCount || 0}</p>
        </div>
        
        <div className="border border-[#E8E6E0] dark:border-zinc-800 p-6 rounded-xl bg-[#F7F5F0] dark:bg-zinc-900/50">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Page Views</h3>
          <p className="text-4xl font-semibold">{viewCount || 0}</p>
        </div>
      </div>
    </div>
  )
}
