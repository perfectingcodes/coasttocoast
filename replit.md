# Running on Replit

This is a Vite/React static-generated site managed with pnpm.

- The **Start application** workflow runs `pnpm dev` on port 5000 for the Replit preview.
- Install dependencies with `pnpm install --frozen-lockfile`.
- Run `pnpm typecheck` to check TypeScript.
- Run `pnpm build` to generate the deployable static site in `dist/public/`.

No secret is required for local preview. Set `VITE_QUOTE_ENDPOINT` only when a live JSON lead-submission endpoint is available; otherwise the quote form opens a prefilled email.