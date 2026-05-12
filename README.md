# Khinext '26

Pakistan's first multi-domain AI Summit + Gaming Arena. Karachi, March 2026.

A Next.js 14 (App Router) + Tailwind + Supabase application: animated public site, public registration + AI Expo submission flows, and a real-time admin dashboard with magic-link auth.

---

## Tech stack

| Layer        | Tool                                                  |
|--------------|-------------------------------------------------------|
| Framework    | Next.js 14 (App Router) + React 18 + TypeScript        |
| Styling      | Tailwind CSS · custom Khinext design tokens            |
| Animation    | Framer Motion (route transitions + scroll reveals)     |
| Database     | Supabase Postgres                                      |
| Auth         | Supabase Auth — password + email magic links           |
| Email        | Resend — transactional / confirmation emails           |
| Realtime     | Supabase Realtime — admin dashboard live-updates       |
| Storage      | Supabase Storage — AI Expo submission file uploads     |
| Deploy       | Vercel (auto-deploy from GitHub)                       |
| Fonts        | Helvetica + Helvetica Now Display (self-hosted)        |
| Icons        | Lucide                                                 |

---

## Folder structure

```
.
├── public/
│   ├── brand/                 Khinext brand assets (logo, glass-hands hero)
│   └── fonts/                 Helvetica + Helvetica Now Display TTFs
│
├── src/
│   ├── app/                   Next.js App Router
│   │   ├── layout.tsx         Root layout (Nav + Footer + PageTransition + skip-link)
│   │   ├── page.tsx           Public homepage
│   │   ├── globals.css        Tailwind + Khinext tokens + base layer
│   │   ├── register/          Public registration page
│   │   ├── submit/            AI Expo submission page (with file upload)
│   │   ├── admin/
│   │   │   ├── page.tsx       Admin dashboard (auth-gated server component)
│   │   │   └── login/         Magic-link sign-in page
│   │   ├── auth/callback/     Supabase OAuth/OTP callback handler
│   │   └── api/admin/         Server-only admin API routes (approve/reject, signout)
│   │
│   ├── components/
│   │   ├── layout/            Nav, Footer, PageTransition
│   │   ├── sections/          Homepage sections (Hero, Stats, Domains, Sponsors, …)
│   │   ├── ui/                Reusable primitives (Field, ChipRadio, PageHero, …)
│   │   └── admin/             Admin-only components (Dashboard, Tables, EmailPreview)
│   │
│   ├── lib/
│   │   ├── types.ts           Row types + domain catalogue + track labels
│   │   └── supabase/
│   │       ├── client.ts      Browser client (anon key)
│   │       ├── server.ts      Server-component client + service-role client
│   │       └── middleware.ts  Cookie refresh + /admin gate
│   │
│   └── middleware.ts          Next.js middleware (delegates to supabase/middleware)
│
├── supabase/
│   └── migrations/
│       └── 001_init.sql       Schema, RLS, storage bucket, realtime publication
│
├── .env.example               Required env vars (copy to .env.local)
├── tailwind.config.ts         Khinext design tokens (colors, shadows, animations)
└── next.config.mjs            Next.js config
```

---

## Pages

| Route                | Description                                                     |
|----------------------|-----------------------------------------------------------------|
| `/`                  | Public homepage: Hero, Event Dates, Stats, Domains, Sponsors, CTA |
| `/register`          | Free attendee registration (Supabase `registrations` insert)    |
| `/submit`            | AI Expo project submission (uploads file to Storage)            |
| `/admin/login`       | Email magic-link sign-in                                        |
| `/admin`             | Admin dashboard — live submissions + registrations, approve/reject |
| `/auth/callback`     | Magic-link OTP exchange handler                                 |
| `/admin/registrations/[id]` | Registration detail — full form + audit + send-email button |
| `/api/admin/submissions/[id]/decide` | POST — approve or reject a submission           |
| `/api/admin/registrations/[id]/send-confirmation` | POST — confirm slot + send Resend email |
| `/api/admin/signout` | Sign out (clears Supabase session cookie)                       |

---

## Setup

### 1. Install
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` → `.env.local` and paste your Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Resend — for confirmation emails
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=Khinext '26 <info@khinext.com>
EMAIL_REPLY_TO=info@khinext.com
```

Find Supabase keys at: **https://supabase.com/dashboard/project/_/settings/api**
Find Resend API key at: **https://resend.com/api-keys**

### 3. Run the SQL migrations
1. Open the SQL Editor in Supabase Studio → **New query**.
2. Paste the contents of `supabase/migrations/001_init.sql` → click **Run**.
3. Open a new query, paste `supabase/migrations/002_email_tracking.sql` → **Run**.

`001_init.sql` creates the `registrations`, `submissions`, and `admins` tables, RLS policies, the `submissions` storage bucket, an `is_admin()` SQL function, and enables realtime replication. `002_email_tracking.sql` adds confirmation-email audit columns to `registrations`.

### 4. Add yourself as an admin
In Supabase SQL Editor:

```sql
insert into public.admins (email)
values ('you@your-org.com');
```

Or just edit the bootstrap line in `supabase/migrations/001_init.sql` before running it.

### 5. Set up Resend (for confirmation emails)
1. Sign up at <https://resend.com> (free 3,000 emails / month).
2. Either:
   - **Verify a domain**: add `khinext.com` under **Domains → Add Domain**, then add the DNS records they show you. ~10 min.
   - **Or for testing**: skip domain setup and change `EMAIL_FROM` to `onboarding@resend.dev` (your real sender will look generic but works without DNS).
3. Generate an API key under **API Keys → Create API Key** (give it `Sending access`) and paste into `.env.local` / Vercel as `RESEND_API_KEY`.

### 6. Allow magic-link redirects
In Supabase Studio → **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (and your Vercel URL when deployed)
- **Redirect URLs**: add `http://localhost:3000/auth/callback` and `https://YOUR-DEPLOY.vercel.app/auth/callback`

### 6. Run locally
```bash
npm run dev
```
Open <http://localhost:3000>.

To test the admin flow:
1. Visit `/admin` — you'll be redirected to `/admin/login`.
2. Enter your whitelisted admin email.
3. Open the magic-link in your inbox.
4. You're now in the dashboard.

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new>, import the repo.
3. Vercel auto-detects Next.js — no config needed.
4. Add the 4 environment variables from `.env.example` in **Project Settings → Environment Variables**.
5. Set `NEXT_PUBLIC_SITE_URL` to your Vercel production URL (e.g. `https://khinext26.vercel.app`).
6. **Important**: update Supabase auth URL configuration (step 5 above) to include the Vercel URL.
7. Vercel will rebuild + deploy on every `git push` to `main`.

---

## Accessibility

- Skip-to-content link rendered first in the DOM, focusable
- Semantic landmarks: `<header>`, `<main>`, `<nav>`, `<footer>`, `<section>` with `aria-labelledby`
- All form inputs have proper `<label>` + `htmlFor` + `autoComplete`
- Radio chip groups expose `role="radiogroup"` + `aria-checked`
- Tabs in admin dashboard use `role="tab"` / `aria-selected`
- Modal traps focus, closes on `Esc`, dims background, locks body scroll
- Visible focus rings on every interactive element (custom Khinext-blue ring)
- `prefers-reduced-motion` respected — Framer Motion + CSS animations disabled when set
- Sponsor logos have `aria-label="… sponsor list"` + per-item `sr-only` tier text
- Colour contrast: white-on-ink and Khinext-blue-on-ink both exceed WCAG AA

---

## Design system

The design follows the Khinext brand:

- **Primary blue**: `#316BFF` (one accent per surface)
- **Ink black**: `#040B1C` (canonical background, hint of navy)
- **Display font**: Helvetica Now Display (Extra Bold Italic is the signature accent face)
- **Body font**: Helvetica
- **Italic-accent treatment**: every page headline gets one blue italic word with a soft radial halo (the `.kx-accent` class)
- **Cards**: 20–24px radius, hairline borders, glass-tint background, blue glow on hover
- **No purple→blue gradients, no emoji decoration** — just one electric kiss of blue per frame

See `src/app/globals.css` for tokens and component primitives, and `tailwind.config.ts` for the theme.

---

## License

Private project. Khinext '26 brand assets © Khinext.
