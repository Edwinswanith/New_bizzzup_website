# Tech Cogniverse website

Next.js (App Router) + TypeScript. One continuous line, drawn in code, from the first tangle to the contact field.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm run start
```

Configuration: copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SITE_URL` for production and `CONTACT_PROVIDER` (+ its keys) to make the contact form deliver. Without a provider, the form states that it cannot deliver and shows direct contact details.

Deploys as a Next.js standalone server (`output: "standalone"`).

See `CLAUDE.md` for architecture and design rules, and `docs/design/redesign/REDESIGN_PLAN.md` for the concept and its reasoning.
