import { createClient } from './lib/supabase/server';

const SITE_URL = 'https://iambasilp.vercel.app';

export default async function sitemap() {
  const supabase = await createClient();

  // Fetch all published posts
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published');

  const notes = (posts || []).map((post) => ({
    url: `${SITE_URL}/writing/${post.slug}`,
    lastModified: post.updated_at || new Date().toISOString()
  }));

  const routes = ['', '/writing'].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString()
  }));

  return [...routes, ...notes];
}
