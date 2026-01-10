# SmoothSpec - Claude Code Instructions

## Mission

**Help gamers figure out where to spend their money.**

PC hardware is expensive. Users come to SmoothSpec with a limited budget and specific games they play. Our job is to tell them exactly which upgrade will give them the biggest performance improvement *for their games* at *their budget*.

Every feature should ask: "Does this help users make smarter purchasing decisions?"

**Core value prop:** "Stop guessing. Know exactly what to upgrade."

---

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

### Game CPU/GPU Weights

Each game has `cpu_weight` and `gpu_weight` values (0.5-1.5 scale) that determine whether it's CPU-bound or GPU-bound.

**Full methodology:** See `docs/GAME_WEIGHTS_METHODOLOGY.md`

**Quick reference:**

- Weights are calibrated for 1440p resolution (adjusted at runtime for 1080p/4K)
- Data comes from YouTube benchmark channels (Digital Foundry, Hardware Unboxed)
- Higher weight = more important for that game
- Example: Valorant (cpu=1.3, gpu=0.7) is CPU-heavy; Cyberpunk (cpu=0.9, gpu=1.4) is GPU-heavy

**When adding new games:**

1. Search for CPU/GPU scaling benchmarks on YouTube
2. Apply the conversion formula in the methodology doc
3. Add source comment in games.sql
4. Validate with the bottleneck calculator UI
