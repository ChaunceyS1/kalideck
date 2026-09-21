# KaliDeck

A cybersecurity learning hub: an indexed Kali Linux tool reference with a
command library, plus an AI tutor. Built mobile-first at 390px, dark terminal
look, deployed on Vercel.

The product name lives in one place — `src/config.ts` (`APP_NAME`). Change it
there and the whole UI follows.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3, `lucide-react` icons
- Supabase for email/password auth and the database
- Gemini, called only from `/api/chat` on the server

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev
```

### Environment variables

| Variable | Where it runs | What it is |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Supabase anon/public key |
| `GEMINI_API_KEY` | server only | Gemini API key. Never prefix this with `NEXT_PUBLIC_` |
| `GEMINI_MODEL` | server only | Optional. Defaults to `gemini-2.0-flash` |

The app builds and renders without Supabase keys so the UI can be worked on
offline; auth actions report that keys are missing instead of throwing.

## Supabase setup

1. Create a project at supabase.com.
2. Authentication → Providers → Email: enable email/password. For fast local
   testing, turn "Confirm email" off; leave it on for production.
3. Authentication → URL Configuration → Redirect URLs: add
   `http://localhost:3000/auth/callback` and
   `https://<your-domain>/auth/callback`.
4. SQL Editor → paste the contents of [`supabase/schema.sql`](supabase/schema.sql)
   and run it.

The full schema also lives inline below so it can be copied without the repo.

### Tables

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## Deploy to Vercel

1. Push this branch to GitHub.
2. Vercel → Add New → Project → import the repo. The framework preset is
   detected as Next.js; no build settings to change.
3. Settings → Environment Variables: add all four variables from the table
   above for Production, Preview, and Development.
4. Deploy, then add `https://<your-domain>/auth/callback` to the Supabase
   redirect URL list.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Landing page and sign-in. Redirects signed-in users to `/tools` |
| `/signup`, `/forgot-password`, `/reset-password` | Auth flows |
| `/auth/callback` | Exchanges Supabase email links for a session |
| `/pricing` | Plan comparison. No checkout yet |
| `/terms`, `/privacy`, `/refund`, `/contact` | Placeholder legal pages |

## Defaults chosen along the way

These were picked without asking, and are easy to change:

- **Layout width.** The brief says desktop-first but to build at 390px first, so
  every page is a single 390px-designed column, centered and capped at 430px
  (520px from the `sm` breakpoint). It reads as a phone app on a desktop screen.
- **Post-login destination** is `/tools`. A visitor bounced off a protected page
  comes back to `/?next=<path>` and lands where they were headed.
- **Gemini model** defaults to `gemini-2.0-flash` and is overridable via
  `GEMINI_MODEL`.
- **Pricing page** exists as a placeholder because the nav capsule links to it.
  No Stripe, no checkout; `profiles.plan` is the only plan signal.
- **Priority Support** card links to `/support`, added alongside the other
  coming-soon stubs.
- **Password minimum** is 8 characters, checked client-side before Supabase.
- **Auth email confirmation** is supported either way: if Supabase returns a
  session immediately, sign-up redirects to `/tools`; otherwise the card asks
  the user to check their inbox.
