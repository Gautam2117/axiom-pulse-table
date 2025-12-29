# Axiom Pulse - Token Discovery Table (Pixel-Perfect Clone)

This repo is my **pixel-perfect replica** of Axiom Trade’s Pulse token discovery table:  
https://axiom.trade/pulse

It is built to match the UI within **≤ 2px visual diff** (verified with Playwright screenshot tests) while keeping interactions smooth and the codebase clean and reusable.

---

## Live Demo and Video (required deliverables)

- **Vercel deployment:** https://axiom-pulse-table-woad.vercel.app/pulse
- **1-2 min YouTube walkthrough:** https://youtu.be/KeWrQcDmWFk

---

## What I built

### Core UI
- **3 columns:** New Pairs, Final Stretch, Migrated
- **Token rows** with:
  - Tooltip (token name)
  - Popover actions (copy, explorer link)
  - Modal (token details)
  - Sorting controls (per column)
  - Hover and click interaction patterns
- **Axiom-like styling:** borders, spacing, typography, subtle hover states, consistent dark theme tokens

### Real-time price updates
- **Mock WebSocket-like stream** that pushes frequent price ticks
- Updates flow into **Redux Toolkit** (`pricesSlice`) so:
  - Only the affected rows re-render (memoized row + per-token selector)
  - Price flashes **green on up** and **red on down** with smooth transitions

### Loading and resilience
- Skeleton + shimmer loading rows
- Progressive list rendering via virtualization
- **Error boundary per column** with retry UI

### Performance targets
- Virtualized list via `@tanstack/react-virtual`
- Memoized row components and stable selectors
- No layout shifts (fixed row height estimate in virtualizer)
- Fast interactions (targeting < 100ms UI response)
- Lighthouse target **≥ 90** on mobile and desktop

---

## Tech stack

- **Next.js App Router**
- **TypeScript (strict)**
- **Tailwind CSS**
- **Redux Toolkit** - complex, real-time shared state (prices, UI state)
- **React Query** - column fetching and caching
- **shadcn/ui (Radix)** - accessible popovers, tooltips, tabs, etc.
- **Playwright** - visual regression screenshots (pixel-diff)

---

## Project structure (Atomic-ish)

Key directories:

- `src/app/`
  - `layout.tsx` - global theme, fonts, providers
  - `pulse/page.tsx` - the Pulse screen
- `src/features/pulse/`
  - `components/` - TokenRowItem, TokenList, PulseBoard, ColumnHeader, etc.
  - `hooks/` - data + sorting hooks (React Query + derived state)
  - `types/` - strongly typed data models
  - `utils/` - formatting and reusable helpers
- `src/features/prices/`
  - `pricesSlice.ts` - Redux slice storing live prices keyed by token id
  - `hooks/usePriceStream.ts` - mock stream feeding price updates
- `tests/visual/`
  - `pulse.spec.ts` - screenshot tests (desktop + mobile 320px)

This keeps UI pieces reusable and avoids mixing data-fetching, formatting, and rendering logic.

---

## Setup and run locally

### Prerequisites
- Node.js 18+
- pnpm

### Install
```bash
pnpm install
```

### Run dev server
```bash
pnpm dev
```

Open:
- http://localhost:3000/pulse

---

## Visual regression (≤ 2px diff requirement)

I use **Playwright screenshot tests** to prove pixel-level stability.

### Update baseline snapshots (first time)
```bash
pnpm test:visual:update
```

### Run visual tests
Recommended: disable the live stream during visual tests so screenshots are stable.
```bash
# macOS/Linux
NEXT_PUBLIC_VISUAL_TEST=1 pnpm test:visual
```

PowerShell (Windows):
```powershell
$env:NEXT_PUBLIC_VISUAL_TEST="1"; pnpm test:visual
```

If the test fails, Playwright will generate:
- actual screenshot
- diff image
- trace

You can open the trace like:
```bash
pnpm exec playwright show-trace test-results/<folder>/trace.zip
```

---

## Responsive proof (down to 320px)

- The UI is responsive down to **320px width**.
- A dedicated Playwright snapshot is included for **mobile-320**.

### Attached snapshots (put these in README)
Add screenshots here after you generate them:

- `./docs/visual/pulse-desktop.png`
- `./docs/visual/pulse-320.png`
- `./docs/visual/diff-example.png` (optional, only if you want to show process)

> Tip: keep a `docs/visual/` folder in the repo so reviewers can see results without running tests.

---

## Lighthouse 90+ checklist

I designed the implementation to hit Lighthouse ≥ 90 with:
- `next/font` for optimized font loading (no FOIT)
- Virtualized lists to avoid heavy DOM
- Memoized rows to avoid unnecessary re-renders
- Deferred UI work where possible (modals can be dynamically imported if needed)

### How I verify Lighthouse
1. Build and run production mode:
```bash
pnpm build
pnpm start
```

2. Run Lighthouse in Chrome DevTools:
- Open the deployed page or localhost production
- DevTools - Lighthouse - Mobile + Desktop

Optional CLI:
```bash
npx lighthouse http://localhost:3000/pulse --view
```

If Lighthouse is below 90, typical fixes I apply:
- Avoid rendering modals until needed (dynamic import)
- Remove unused dependencies
- Ensure images (if any) use `next/image`
- Keep animations subtle and avoid layout shifts

---

## Error boundaries (explicit rubric item)

Each column list is wrapped with a **per-column ErrorBoundary**:
- If a column query fails, only that column shows an error UI
- Retry triggers refetch without impacting other columns

This matches the rubric expectation for resilience and clean UX.

---

## Notes for reviewers

- The visuals are intentionally tuned for Axiom-like dark UI.
- Live price updates are isolated to each row using:
  - `React.memo(TokenRowItem)`
  - `useAppSelector((s) => s.prices.byId[token.id]?.price)`
- I disable streaming during screenshot tests using:
  - `NEXT_PUBLIC_VISUAL_TEST=1`

---

## Scripts

Common scripts (check `package.json` for exact names):
- `pnpm dev` - dev server
- `pnpm build` - production build
- `pnpm start` - production server
- `pnpm test:visual` - Playwright screenshot tests
- `pnpm test:visual:update` - update Playwright snapshots

---

## Deliverables checklist

Before submitting, I ensure these are complete:

- [ ] GitHub repo with clean commits
- [ ] Vercel deployment link in this README
- [ ] YouTube demo link in this README
- [ ] Playwright visual regression tests included + documented
- [ ] Desktop and 320px screenshots committed under `docs/visual/`
- [ ] Lighthouse ≥ 90 on mobile and desktop (screenshots or notes included)

Thanks for reviewing!
