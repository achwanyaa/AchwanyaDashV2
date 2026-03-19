# Deploy Achwanya 3D Tours Dashboard

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project (database + auth)
- Vercel account (recommended) or any Node.js host

## Environment Variables
Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_ADMIN_USER_ID=admin-uuid-from-supabase-auth
LEAD_WEBHOOK_URL=https://your-webhook-url (optional)
```

## Database Setup
Run these SQL commands in Supabase SQL Editor:

```sql
-- Profiles table
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  whatsapp_number text,
  plan_type text default 'basic',
  plan_expires_at timestamptz,
  created_at timestamptz default now()
);

-- Tours table
create table tours (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles not null,
  title text not null,
  address text not null,
  industry text not null,
  realsee_url text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Tour views table
create table tour_views (
  id uuid default gen_random_uuid() primary key,
  tour_id uuid references public.tours not null,
  owner_id uuid references public.profiles not null,
  session_id text not null,
  created_at timestamptz default now()
);

-- Leads table
create table leads (
  id uuid default gen_random_uuid() primary key,
  tour_id uuid references public.tours not null,
  owner_id uuid references public.profiles not null,
  full_name text not null,
  phone text not null,
  created_at timestamptz default now()
);

-- Bookings table
create table bookings (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles not null,
  property_name text not null,
  address text not null,
  preferred_date date not null,
  property_type text,
  bedrooms integer,
  notes text,
  status text default 'requested',
  created_at timestamptz default now()
);

-- RLS Policies
alter table profiles enable row level security;
alter table tours enable row level security;
alter table tour_views enable row level security;
alter table leads enable row level security;
alter table bookings enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admin can view all profiles" on profiles for select using (auth.uid() = 'NEXT_PUBLIC_ADMIN_USER_ID');

create policy "Users can view own tours" on tours for select using (auth.uid() = owner_id);
create policy "Admin can view all tours" on tours for select using (auth.uid() = 'NEXT_PUBLIC_ADMIN_USER_ID');
create policy "Admin can insert tours" on tours for insert with check (auth.uid() = 'NEXT_PUBLIC_ADMIN_USER_ID');

create policy "Users can view own tour views" on tour_views for select using (auth.uid() = owner_id);
create policy "Admin can view all tour views" on tour_views for select using (auth.uid() = 'NEXT_PUBLIC_ADMIN_USER_ID');
create policy "Anyone can insert tour views" on tour_views for insert with check (true);

create policy "Users can view own leads" on leads for select using (auth.uid() = owner_id);
create policy "Admin can view all leads" on leads for select using (auth.uid() = 'NEXT_PUBLIC_ADMIN_USER_ID');
create policy "Anyone can insert leads" on leads for insert with check (true);

create policy "Users can view own bookings" on bookings for select using (auth.uid() = owner_id);
create policy "Admin can view all bookings" on bookings for select using (auth.uid() = 'NEXT_PUBLIC_ADMIN_USER_ID');
create policy "Users can insert bookings" on bookings for insert with check (auth.uid() = owner_id);
create policy "Admin can update bookings" on bookings for update using (auth.uid() = 'NEXT_PUBLIC_ADMIN_USER_ID');
```

## Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:3000
```

## Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

## Admin Setup
1. Create admin user in Supabase Auth
2. Copy admin UUID to `NEXT_PUBLIC_ADMIN_USER_ID`
3. Access `/admin` after login

## Post-Deploy Checklist
- [ ] Environment variables configured
- [ ] Database schema created
- [ ] RLS policies applied
- [ ] Admin user created
- [ ] Test login flow
- [ ] Test tour creation
- [ ] Test lead capture
- [ ] Test admin panel
