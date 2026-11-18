# Ashutosh Dubey: Portfolio

A static, animated portfolio built with React, TypeScript, Vite, Framer Motion and Lottie.
All content lives in one file: **`src/data/profile.json`**.

## Run it locally

```bash
npm install        # first time only
npm run dev        # http://localhost:5173, reloads as you edit
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Update your details

Edit `src/data/profile.json`, save, and the page updates. Empty values hide their
section or link automatically.

| What | Where in `profile.json` |
|---|---|
| Name, role, typewriter roles, tagline | `personal` |
| "Open to opportunities" pill | `personal.availability.open` (true / false) |
| Floating badges around the photo | `personal.heroBadges` |
| Code card next to the photo | `personal.codeCard` (any key: value pairs) |
| About text and highlights | `about` |
| Number counters | `stats` |
| Jobs (newest first) | `experience` |
| Projects (`featured: true` shows it on the phone) | `projects` |
| Project links (Live, GitHub, Play Store, App Store) | `projects[].links` |
| Skill groups (`icon`: code, cloud, smartphone, wrench, users, layers) | `skills` |
| Education | `education` |
| Contact details; show phone / WhatsApp | `contact.showPhone`, `contact.showWhatsapp` |
| LinkedIn, GitHub, X, Instagram, Medium links | `socials` |
| Page title, description, share preview | `meta` (set `meta.siteUrl` once you have a domain) |

### Photos, resume and animations

- Replace `public/assets/profile.jpg` (hero) and `public/assets/casual.jpg` (About).
- Resume: replace `public/assets/Ashutosh_Dubey_Resume.pdf`. The **View Resume**
  button (top right) shows it inside the page; `personal.resume.viewUrl` must be a PDF,
  since browsers can't display `.docx`. `personal.resume.downloadUrl` (used by the
  Download buttons) can point to the PDF or the `.docx`. Export the PDF from Word for
  the exact original layout.
- Lottie animations are in `public/lottie/`. Any JSON from LottieFiles can replace
  one; keep the file name. The site uses the light Lottie engine, so animations that
  rely on After Effects expressions won't play (switch `LottieLight` to `Lottie` in
  `src/components/LottiePlayer.tsx` if you need them).

### Contact form

With `contact.formEndpoint` empty, the form opens the visitor's email app with the
message filled in. To receive messages directly, create a free form at
[Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) and paste its
endpoint URL into `contact.formEndpoint`.

## Deploy (free) on Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com), choose **Add New → Project** and import the repo.
   Vercel detects Vite; keep the defaults (build `npm run build`, output `dist`).
3. Every `git push` redeploys the site in about a minute, so updating your details is:
   edit `profile.json`, commit, push.

Netlify and Cloudflare Pages work the same way (build command `npm run build`,
publish directory `dist`).

### Custom domain

In Vercel: **Project → Settings → Domains → Add**, enter your domain, then add the DNS
records Vercel shows at your registrar. HTTPS is set up automatically. Afterwards set
`meta.siteUrl` in `profile.json` to the new URL so link previews show your photo.

## Accessibility & motion

Animations respect the visitor's "reduce motion" setting: Lottie files pause, the
typewriter shows a single role, and tilt / parallax / auto-advance turn off.
