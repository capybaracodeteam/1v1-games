# 1v1-games Project

## Architecture
- **Client**: Next.js App Router (`/client`) — deployed on Vercel
- **Server**: Node.js + Socket.io (`/server`) — deployed on Railway
- **Shared types**: `/packages/shared`

## Live URLs
- Client: https://1v1-games.vercel.app
- Server: https://1v1-games-server-production.up.railway.app
- Health check: https://1v1-games-server-production.up.railway.app/health

## Deployment IDs
- Railway project ID: `1d63c016-2dd3-427a-9ccd-89b688641732`
- Railway service ID: `53420cf2-ecc2-496b-8df9-201e41c8c84b`

## Environment Variables
- Railway: `CLIENT_ORIGIN=https://1v1-games.vercel.app`
- Vercel: `NEXT_PUBLIC_SERVER_URL=https://1v1-games-server-production.up.railway.app`
- Local: `NEXT_PUBLIC_SERVER_URL=http://localhost:4000` (in `client/.env.local`)

## Design System

The site uses a dark, competitive arcade aesthetic.

**"Revamp the UI"** means: reformat the target page/component to follow this design system exactly.

**New features, games, or components** should be built functionally correct first — do NOT apply this design system during initial implementation. UI revamps come after, as a separate step.

### Colors
- Background: `#0d0d0d` (near-black) — set as `--background` in `globals.css`
- Foreground: `#f0f0f0` (off-white) — set as `--foreground`
- Accent: `#F5C518` (gold/yellow) — set as `--accent`; use for highlights, hover states, glows

### Fonts
- **Bebas Neue** (`font-bebas`) — display/heading font; use for big titles, labels, VS text
- **Geist Sans** (`font-sans`) — body font for readable UI text

### Personality
- Large, bold Bebas Neue headers (e.g. `text-6xl` to `text-9xl`)
- Gold glow effects on key elements: `textShadow: "0 0 40px #F5C518, 0 0 80px #F5C51866"`
- Cards: dark glass style — `border border-white/10 rounded-2xl bg-white/5`, hover to `border-accent/60 bg-accent/5` with gold box-shadow
- Dividers: `h-px w-48 bg-accent/30`
- Subtle text: `text-foreground/60`
- Spacing: generous padding (`p-8`, `py-16`), gaps (`gap-6`, `gap-12`)
- Transitions: `duration-200` for hover effects

### Tailwind Usage
- `bg-background`, `text-foreground`, `text-accent`, `bg-accent` — all wired up via `@theme inline` in `globals.css`
- `font-bebas` — available globally via CSS variable from `layout.tsx`

## Useful CLI Commands
- Railway logs: `railway logs --service 53420cf2-ecc2-496b-8df9-201e41c8c84b`
- Railway deploy: `railway up --service 53420cf2-ecc2-496b-8df9-201e41c8c84b`
