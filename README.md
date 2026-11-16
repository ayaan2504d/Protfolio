# Syed Ayan Ahmed Jafri — Portfolio

A React, Vite, Tailwind CSS, and React Three Fiber portfolio.

## Local development

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

The site can be built with `npm run build` and served locally with `npm run preview`.

## Contact form email delivery

The contact form posts to the server-side `/api/contact` endpoint. Nodemailer sends messages over SMTP; credentials are read only by the Node server and must never use a `VITE_` prefix.

For local development, copy `.env.example` to `.env` and set:

- `SMTP_HOST` — Gmail SMTP host, usually `smtp.gmail.com`
- `SMTP_PORT` — usually `587` (STARTTLS) or `465` (implicit TLS)
- `SMTP_SECURE` — `false` for port 587 or `true` for port 465
- `SMTP_USER` — the account address used to authenticate and send (it can differ from `ADMIN_EMAIL`)
- `SMTP_PASS` — the SMTP password or provider app password; for Gmail, use an app password, not your account password
- `ADMIN_EMAIL` — inbox that receives contact messages

The Vite development server exposes the same API handler locally. In production, Vercel deploys `api/contact.js` as a Node serverless function. Configure the five variables in the Vercel project's environment settings before deploying; do not commit `.env`. The server validates all fields, rejects cross-origin requests, checks a hidden honeypot, limits each client to five submissions per 15 minutes per running instance, and includes the server-generated UTC submission time in the email.

After configuring SMTP, restart the development server and submit a real message. Confirm it arrives at `ADMIN_EMAIL` (including Spam), and reply to verify the visitor's address is used as Reply-To. Automated tests use a mocked email sender and do not send real mail.

## Replaceable images and project links

- Replace `public/images/profile-placeholder.png` with the profile image and update its alternative text in `src/sections/Hero.jsx` to describe the actual image.
- Replace `public/images/projects/masjid-finder.png`, `asan-service.png`, `bizflow.png`, and `ngo-website.png` with project screenshots. Paths, repository links, and project copy are centralized in `src/data/projects.js`.
- The project cards link to the specified GitHub repositories only; no live-demo URLs are presented.

## SEO placeholders

Before publishing, replace every `https://your-domain.example/` placeholder in `index.html`, `public/robots.txt`, and `public/sitemap.xml` with the final canonical HTTPS domain. Replace the profile placeholder with a real share image if desired.

## Vercel

The included `vercel.json` uses Vite's `npm run build` command, publishes `dist`, and provides an SPA fallback. To prepare deployment:

1. Push this existing project to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import that repository, and keep the detected Vite settings (build command `npm run build`, output directory `dist`).
3. Add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `ADMIN_EMAIL` under **Project Settings → Environment Variables** for the environments where the site should run. Redeploy after changing variables.
4. Replace the canonical-domain placeholders, then configure the desired domain under **Project Settings → Domains**. Follow Vercel's displayed DNS instructions at your domain registrar and wait for verification.
5. Preview and test the deployment, including sending a real contact-form test, before sharing it.

No deployment or publication has been performed.
"# Protfolio" 
"# Protfolio" 
