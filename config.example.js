// ============================================================
// ABC Coaching — configuration (EXAMPLE, public/portfolio copy)
// ------------------------------------------------------------
// Placeholders only — no real credentials, no link to any live
// Supabase project.
//
// To run the site with a live database:
//   1. Copy this file to  js/config.js   (same folder)
//   2. Fill in YOUR OWN values from the Supabase dashboard:
//      Project Settings → API → Project URL + anon public key.
//   3. Create your admin user in Supabase Auth and sign in to
//      admin/index.html
//
// Without config.js the site still works: animations, layout and
// the admin panel render normally — the register form simply shows
// a friendly "not connected" message instead of submitting.
//
// Note: The admin desk now uses **Supabase Auth** (email + password).
// There is no shared PIN anymore. Keep js/config.js OUT of any
// public repository.
// ============================================================

const ABC_CONFIG = {
  SUPABASE_URL: "https://YOUR_PROJECT.supabase.co",
  SUPABASE_ANON_KEY: "YOUR_ANON_PUBLIC_KEY",
};

// Convenience flag: has the project been configured yet?
ABC_CONFIG.isConfigured =
  !ABC_CONFIG.SUPABASE_URL.includes("YOUR_PROJECT") &&
  !ABC_CONFIG.SUPABASE_ANON_KEY.includes("YOUR_ANON");

const ABC_DB =
  ABC_CONFIG.isConfigured && typeof supabase !== "undefined"
    ? supabase.createClient(ABC_CONFIG.SUPABASE_URL, ABC_CONFIG.SUPABASE_ANON_KEY)
    : null;