# The Ultimate Writer's Guide to Your CMS

Welcome to your brand-new, completely private, and highly optimized Content Management System. This guide will show you exactly how to write, format, and manage your platform.

---

## 1. Accessing the Admin Dashboard

Your entire website is controlled from a single, secure login page.

**How to log in:**
1. Navigate to: `https://iambasilp.com/admin` (or `http://localhost:3000/admin` locally).
2. Enter your secure master password.
3. You will be immediately redirected to the **Overview Dashboard**, where you can see your Total Page Views and Total Published Posts.

*(Note: If you ever need to change your admin password, you can do so directly in your Supabase Authentication dashboard under Users).*

---

## 2. Managing Your Essays

From the Admin Dashboard, click on **Posts** in the sidebar.

- **Drafts vs Published:** When you click "New Post", the status is automatically set to `draft`. Drafts will **never** appear on your live website until you explicitly change their status to `published` and hit Update.
- **Title vs Slug:** The `Title` is what humans read (e.g. "How to Wake Up Early"). The `Slug` is the URL (e.g. `how-to-wake-up-early`). Make sure slugs only use lowercase letters and hyphens!
- **Deleting:** Deleting a post is permanent. You will be asked for confirmation.

---

## 3. Formatting Your Text (The Editor)

Your text editor uses **Markdown**, a standard writing format that allows you to style your text without ever taking your hands off the keyboard.

### Basic Styling
- **Bold:** Wrap text in double stars `**like this**`
- **Italics:** Wrap text in single stars `*like this*`
- **Headers:** Use hashtags before a line.
  - `# Massive Title`
  - `## Section Header`
  - `### Small Subheader`
- **Quotes:** Use a greater-than sign `> This is a blockquote.`
- **Bullet Lists:** Start lines with a dash `- item one`

### Custom Typography Features 
We built custom aesthetic components directly into your editor! You can type these exactly as written below into your editor:

**1. The Drop Cap (Huge First Letter)**
To make the first letter of a paragraph massive and elegant, wrap the paragraph in `<DropCap>` tags:
```mdx
<DropCap>
There was once a man who decided to change his life forever.
</DropCap>
```

**2. The Highlight (Yellow Marker)**
To emphasize a specific sentence with a yellow marker background, wrap the text in `<Highlight>` tags:
```mdx
The most crucial rule is <Highlight>never give up.</Highlight>
```

---

## 4. How the Analytics Work

Your website has a custom-built, **100% invisible, cookie-free analytics tracker**. 
You do not need to do anything to maintain it. 

- **How it works:** Every time someone visits your site, the backend securely hashes their IP address to generate an anonymous `visitor_id`. It logs what page they visited, what device they used (Mobile/Desktop), and how they got there (Referrer).
- **Privacy First:** Because it does not use cookies, there are no annoying "Cookie Consent" popups on your website. 
- **Admin Excluded:** If you are browsing the `/admin` dashboard, the tracker automatically shuts off so your own stats aren't polluted.

You can view your total global page views on the main Admin Dashboard overview screen. To see highly detailed analytics (like which specific articles are getting the most views), you can open your Supabase `analytics_events` table!

---

## 5. SEO & Lighthouse

Your website is structurally mathematically perfect. 
- **Performance:** All your essays are fully statically pre-compiled (0.5s load times).
- **SEO:** It automatically generates a `sitemap.xml` that updates instantly when you publish a new post, and alerts Google to crawl it via `robots.txt`.
- **Sharing Links:** If you text a link of your site to a friend, or post it on LinkedIn/Twitter, it will automatically generate a beautiful Rich Link preview card. 

Happy writing! 🖋️
