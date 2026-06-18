-- Run this in your Supabase SQL Editor to create the habit tracker table

drop table if exists salah_tracking;

create table salah_tracking (
  id uuid default uuid_generate_v4() primary key,
  date date not null unique,
  fajr smallint default 0 check (fajr >= 0 and fajr <= 5),
  dhuhr smallint default 0 check (dhuhr >= 0 and dhuhr <= 5),
  asr smallint default 0 check (asr >= 0 and asr <= 5),
  maghrib smallint default 0 check (maghrib >= 0 and maghrib <= 5),
  isha smallint default 0 check (isha >= 0 and isha <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table salah_tracking enable row level security;

-- Allow public to view the habit tracker (acts as public commitment device)
create policy "Salah tracking is viewable by everyone" on salah_tracking for select using (true);

-- Only Admin can insert and update their tracker
create policy "Admins can insert salah tracking" on salah_tracking for insert with check (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

create policy "Admins can update salah tracking" on salah_tracking for update using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Trigger for updated_at (reuses the function created in your main setup script)
create trigger update_salah_tracking_updated_at
    before update on salah_tracking
    for each row
    execute procedure update_updated_at_column();
