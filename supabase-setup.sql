-- Supabase CMS Setup Script
-- Run this in your Supabase SQL Editor

-- 1. Create Profiles Table (Linked to Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  role text check (role in ('admin', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Function to handle new user signups automatically
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create Posts Table
create table posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  status text check (status in ('draft', 'published')) default 'draft',
  featured_image text,
  reading_time integer default 0,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  seo_title text,
  seo_description text
);

alter table posts enable row level security;
create policy "Posts are viewable by everyone if published" on posts for select using (status = 'published');
create policy "Admins can view all posts" on posts for select using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can insert posts" on posts for insert with check (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can update posts" on posts for update using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can delete posts" on posts for delete using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- 3. Create Categories & Tags
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique
);

create table tags (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique
);

create table post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

alter table categories enable row level security;
create policy "Categories are viewable by everyone" on categories for select using (true);

alter table tags enable row level security;
create policy "Tags are viewable by everyone" on tags for select using (true);

-- 4. Newsletter Subscribers
create table newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  status text check (status in ('pending', 'subscribed', 'unsubscribed')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table newsletter_subscribers enable row level security;
-- Public can insert (subscribe)
create policy "Anyone can subscribe" on newsletter_subscribers for insert with check (true);
-- Only admins can view list
create policy "Admins can view subscribers" on newsletter_subscribers for select using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- 5. Analytics Tracker
create table analytics_events (
  id uuid default uuid_generate_v4() primary key,
  path text not null,
  visitor_id text not null,
  referrer text,
  device_type text,
  country text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table analytics_events enable row level security;
create policy "Anyone can insert analytics" on analytics_events for insert with check (true);
create policy "Admins can view analytics" on analytics_events for select using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Helper functions
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_posts_updated_at
    before update on posts
    for each row
    execute procedure update_updated_at_column();
