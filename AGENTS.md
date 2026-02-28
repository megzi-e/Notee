# AGENTS.md

## Cursor Cloud specific instructions

This is a client-side React + TypeScript + Vite note-taking SPA (`note-app`). There is no backend, database, or external services — all data persists in browser `localStorage`.

### Running the app

- **Dev server**: `npm run dev` (Vite with HMR, serves on port 5173 by default)
- **Build**: `npm run build` (runs `tsc -b && vite build`)
- **Preview**: `npm run preview` (serves the production build)

See `package.json` `scripts` for the canonical commands.

### Key caveats

- The `@central-icons-react` packages require a `CENTRAL_LICENSE_KEY` environment variable at install time. Use `npm install --ignore-scripts` to bypass the license check during dependency installation — the icons still work at runtime without the key.
- There is no ESLint or Prettier configuration in the project. TypeScript type-checking (`tsc -b`) is the primary lint-equivalent check.
- There is no test framework configured (no Jest, Vitest, etc.). Manual testing via the browser is the only verification method.
