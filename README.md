# Axel's Boilerplate

Animated landing-page starter. Next.js App Router + React 19 + Tailwind v4 + Framer Motion + Lenis smooth-scroll.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What's in `src/`

- `app/layout.tsx` — root layout, metadata, font wiring, smooth-scroll provider
- `app/page.tsx` — composes the home sections in order
- `app/globals.css` — Tailwind + theme tokens
- `components/header.tsx` — sticky header with mobile menu
- `components/hero.tsx` — headline + CTA
- `components/social-proof.tsx` — avatar marquee
- `components/feature-carousel.tsx` — scrolling feature cards
- `components/comparison.tsx` — animated comparison chart
- `components/showcase-section.tsx` — image + feature tabs
- `components/testimonials.tsx` — testimonial grid
- `components/cta-section.tsx` — closing call-to-action + footer
- `components/ui/gradient-button.tsx` — shared button primitive
- `lib/motion.ts` — Framer Motion variants
- `lib/utils.ts` — `cn` helper

## To rebrand it for your own project

1. Edit metadata in `src/app/layout.tsx` (title, description, OG, Twitter)
2. Replace `public/logo.svg`
3. Update the page URL in `src/app/sitemap.ts` and `public/robots.txt`
4. Swap copy in each section component under `src/components/`
5. Adjust theme tokens in `src/app/globals.css`

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier write |
