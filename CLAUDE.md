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

## Useful CLI Commands
- Railway logs: `railway logs --service 53420cf2-ecc2-496b-8df9-201e41c8c84b`
- Railway deploy: `railway up --service 53420cf2-ecc2-496b-8df9-201e41c8c84b`
