# SmoothSpec - Claude Code Instructions

## GitHub Account

This repository uses the `tuckerandrew21` GitHub account, NOT `andrew-tucker-razorvision`.

When pushing or creating PRs, ensure you're authenticated as `tuckerandrew21`:
```bash
gh auth status  # Should show tuckerandrew21
```

## Project Overview

SmoothSpec is a PC gaming upgrade advisor that helps users identify hardware bottlenecks and recommends upgrades with real-time pricing from multiple retailers.

## Key Directories

- `src/app/` - Next.js App Router pages and server actions
- `src/components/` - React components (UI in `ui/`, features in `results/`, `wizard/`)
- `src/lib/` - Core utilities (retailers, bestbuy API, supabase, analytics)
- `src/types/` - TypeScript type definitions

## Retailer System

Three retailers are supported:
- **Best Buy** - Has API integration (`BESTBUY_API_KEY`), returns real prices
- **Amazon** - Search links only (future: Product Advertising API)
- **Newegg** - Search links only (future: CJ Affiliate API)

All adapters implement `RetailerClient` interface in `src/lib/retailers/types.ts`.

## Environment Variables

Required for full functionality:
- `BESTBUY_API_KEY` - Best Buy API key
- `BESTBUY_AFFILIATE_ID` - Impact Radius affiliate ID (optional)
- `AMAZON_PARTNER_TAG` - Amazon Associates tag (optional)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

## Component Database

**Location:** `supabase/seed/*.sql` (cpus.sql, gpus.sql, games.sql, peripherals.sql)

**Constraints:**
- Desktop components only - no laptop/mobile variants
- Benchmark scores use PassMark scale (CPU: 0-60000, GPU: 0-40000)

### Adding New Components - Prioritization Strategy

Use **Steam Hardware Survey** to prioritize which components to add:
1. Check https://store.steampowered.com/hwsurvey/ for current market share
2. Filter out laptop variants (e.g., "RTX 4060 Laptop GPU")
3. Prioritize components with highest market share first
4. Get benchmark scores from PassMark (CPU: cpubenchmark.net, GPU: videocardbenchmark.net)

For games, use **SteamCharts** (steamcharts.com) to identify most-played titles.

This ensures we cover hardware that actual gamers use, not just the latest releases.
