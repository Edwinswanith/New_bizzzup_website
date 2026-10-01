# Tech Cogniverse website

Next.js (App Router) + TypeScript. One continuous line, drawn in code, from the first tangle to the contact field.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm run start
```

Configuration: copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to the custom production domain; on Vercel the app can fall back to `VERCEL_PROJECT_PRODUCTION_URL` when system env vars are exposed. For automatic contact delivery, set `CONTACT_PROVIDER=resend`, `RESEND_API_KEY`, and a verified `CONTACT_FROM`; `CONTACT_TO` defaults to `edwinswanith006@gmail.com` if left empty. Without a provider, or if provider delivery fails, the form opens a prefilled email draft addressed to the company email instead of losing the enquiry.

Deploys as a Next.js standalone server (`output: "standalone"`).

See `CLAUDE.md` for architecture and design rules, and `docs/design/redesign/REDESIGN_PLAN.md` for the concept and its reasoning.
