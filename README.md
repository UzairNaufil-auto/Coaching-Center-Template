# ABC Coaching — Coaching Centre Template

A ready-to-rebrand coaching-centre website: a **public site** plus an **admin panel**
(Admissions Desk), built with plain **HTML / CSS / JS**, animated with **GSAP +
ScrollTrigger + Lenis**, backed by **Supabase**.

```
coaching-site/
├── index.html          ← public site (goes live)
├── css/style.css       ← design system + layout
├── js/config.example.js ← placeholders — copy to config.js + fill in
├── js/config.js        ← ⚙️ your Supabase keys live here (never commit)
├── js/main.js          ← smooth scroll, animations, registration form
├── admin/
│   ├── index.html      ← admin panel (Admissions Desk)
│   ├── admin.css
│   └── admin.js        ← waiting list, enrolment, attendance
└── supabase/schema.sql ← database schema (run once)
```

> **About the two config files** — `js/config.js` holds your real Supabase
> URL, anon key and admin PIN and must **never** go into a public repository.
> The public repo only carries `js/config.example.js` (safe placeholders).
> The site runs fine with neither present: the register form and admin desk
> show a "demo mode / not connected" notice instead of submitting.

## 1. Create the backend (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** → paste the entire contents of `supabase/schema.sql` → **Run**.
   - This creates the `registrations` and `attendance` tables, permissions, and two
     sample waiting-list requests so the panel isn't empty.
3. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon public key**

## 2. Connect the site

Create `js/config.js` from the example and fill in your values:

```powershell
copy js\config.example.js js\config.js
```

```js
SUPABASE_URL: "https://xyzcompany.supabase.co",
SUPABASE_ANON_KEY: "eyJhbGciOi...",   // your own anon public key
```

That file is shared by both sites — one edit connects everything.

## 3. Run it locally

Static hosting is enough (no build step). Either:

- **VS Code**: install *Live Server*, right-click `index.html` → *Open with Live Server*, or
- **Terminal**:
  ```powershell
  npx serve "path\to\coaching-site"
  ```

Open `admin/index.html` — you'll be prompted to **sign in** with the staff
account you created in Supabase Auth. (Without `js/config.js`, the admin
panel shows a **demo-mode notice** instead — that's the intended
public/portfolio behaviour.)

## 4. Publish — two repos

| Repo | Contents | Purpose |
|---|---|---|
| **Public** (portfolio) | Everything **except** `js/config.js` (which is replaced by `js/config.example.js`) | Shows your work: clone it, open `index.html`, it runs in demo mode |
| **Private** (hosting) | Everything **including** `js/config.js` with your real keys | Deploy from here to **Netlify, Vercel, Cloudflare Pages, GitHub Pages or cPanel**. No build command needed |

Rules that keep this safe:

- `js/config.js` never enters the public repo — not in a commit, never.
- If a real key is ever committed publicly, **regenerate the anon key**
  (Dashboard → Project Settings → API) — deleting the file isn't enough, keys stay
  in git history.
- **RLS now protects the data.** With the schema above, the anon key can
  only INSERT registrations (status `waiting`) — it cannot read, update or
  delete anything. The admin desk requires **Supabase Auth login**. That
  said, any client on the internet can still submit the form; rate-limiting
  (e.g. an Edge Function) is optional if spam becomes an issue.

## How the flow works

1. A student fills **Register** on the public site → row inserted into
   `registrations` with `status = 'waiting'`.
2. The admin panel's **Waiting list** shows the request (live, via Supabase
   realtime).
3. **Confirm enrolment** flips `status` to `'enrolled'` → the student appears
   under **Enrolled**.
4. Under **Enrolled**, tick the checkbox for each of the five working days
   (Mon–Fri). Use the `‹ ›` arrows to review or edit past/future weeks.
   Each tick upserts a row into `attendance` (one row per student per day).
5. **Decline** or **Remove** deletes the record (attendance cascades with it).

## Rebranding tips

- Site name, hero copy, programs (SSC I–II / HSSC I–II), faculty names, stats and
  footer are placeholders — edit them directly in `index.html`.
- Contact details in the footer and form are neutral placeholders by design.
- The admin panel is **not linked or referenced from the public site** anymore, so
  the panel's URL stays out of the public HTML.

## Notes

- **Admin auth**: Supabase Auth is used for the Admissions Desk.
  - Disable **Allow new users to sign up** in *Authentication → Providers → Email*,
    then *Authentication → Users → Add user* to create your staff account.
  - `supabase/schema.sql` restricts the anon key to **insert-only** for `registrations`
    (status `waiting`); all reads/writes on `registrations` and everything on
    `attendance` require an **authenticated** user. The public site remains usable.
- Attendance is only meant for Mon–Fri; the panel shows "No classes today" on
  weekends.
- Animations respect `prefers-reduced-motion`, and the site still works fully
  if the animation CDNs fail to load.