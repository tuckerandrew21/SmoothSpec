# Game CPU/GPU Weights Methodology

This document describes how SmoothSpec determines whether a game is CPU-bound or GPU-bound using benchmark data from trusted tech YouTube channels.

## Overview

Each game in our database has two weight values:
- **cpu_weight** (0.5-1.5): How much CPU performance matters for this game
- **gpu_weight** (0.5-1.5): How much GPU performance matters for this game

Higher weight = more important for that game's performance.

## Data Sources

We extract weights from benchmark videos by these trusted sources (in priority order):

1. **Digital Foundry** - Gold standard for technical analysis
2. **Hardware Unboxed** - Comprehensive CPU/GPU scaling tests
3. **Gamers Nexus** - Detailed hardware benchmarks
4. **Tom's Hardware** - Benchmark articles with data tables

These channels perform real hardware tests showing how games scale with different CPUs and GPUs.

## Conversion Formula

When a benchmark video shows FPS improvements from upgrading CPU vs GPU:

```
Input: FPS improvement when upgrading GPU vs upgrading CPU (same % tier jump)

gpu_scaling = (new_fps_gpu - base_fps) / base_fps
cpu_scaling = (new_fps_cpu - base_fps) / base_fps
ratio = gpu_scaling / (gpu_scaling + cpu_scaling)

gpu_weight = 0.5 + (ratio * 1.0)  // Maps to 0.5-1.5 range
cpu_weight = 2.0 - gpu_weight     // Inverse relationship (typically)
```

### Example: Cyberpunk 2077

From Digital Foundry benchmark:
- 20% GPU upgrade (RTX 3060 → 3080) → 35% FPS gain
- 20% CPU upgrade (i5-10400 → i9-13900K) → 8% FPS gain

Calculation:
- ratio = 35 / (35 + 8) = 0.81
- gpu_weight = 0.5 + 0.81 = 1.31 → **1.3**
- cpu_weight = **0.9** (with minimum floor)

Result: Cyberpunk is GPU-heavy (1.3 GPU weight vs 0.9 CPU weight).

### Alternative Method: GPU-Busy Deviation

Some benchmarks show "GPU busy" or "GPU utilization" metrics:
- **0-20% GPU busy deviation**: GPU-bound (gpu_weight 1.3-1.5)
- **20-40% deviation**: Balanced (weights ~1.0-1.1)
- **40%+ deviation**: CPU-bound (cpu_weight 1.2-1.5)

## Resolution Modifier

Base weights are calibrated for **1440p resolution**. At runtime, we apply a modifier based on the user's actual gaming resolution:

| Resolution | CPU Modifier | GPU Modifier | Reasoning |
|------------|--------------|--------------|-----------|
| 1080p | +0.10 | -0.10 | GPU finishes faster, CPU becomes bottleneck |
| 1440p | 0 | 0 | Baseline (weights stored as-is) |
| 4K | -0.20 | +0.20 | 4x pixels of 1080p, GPU-bound for almost all games |

### Physics Rationale

- **GPU workload** scales with pixel count (resolution)
- **CPU workload** is mostly resolution-independent (game logic, physics, draw calls)

At 1080p (2.07M pixels), GPUs complete frames quickly, leaving CPUs as the bottleneck.
At 4K (8.29M pixels, 2.25x of 1440p), GPUs become the bottleneck for nearly every game.

### Validation

| Game | Base (1440p) | 1080p Adjusted | 4K Adjusted | Matches Benchmarks |
|------|--------------|----------------|-------------|-------------------|
| Valorant | 1.3/0.7 | 1.4/0.6 | 1.1/0.9 | Yes |
| Counter-Strike 2 | 1.3/0.8 | 1.4/0.7 | 1.1/1.0 | Yes |
| Elden Ring | 1.1/1.1 | 1.2/1.0 | 0.9/1.3 | Yes |
| Cyberpunk 2077 | 0.9/1.4 | 1.0/1.3 | 0.5/1.5 | Yes |

## Adding New Games

When adding a new game to `supabase/seed/games.sql`:

### Step 1: Find Benchmark Data

Search for: `"[Game Name]" CPU GPU scaling benchmark site:youtube.com`

Look for videos that show:
- Same game tested with different CPUs (same GPU)
- Same game tested with different GPUs (same CPU)
- Frame time analysis or GPU utilization metrics

### Step 2: Extract Scaling Data

Note the FPS differences when upgrading:
- From mid-range to high-end CPU (e.g., i5 → i9)
- From mid-range to high-end GPU (e.g., RTX 3060 → 3080)

### Step 3: Calculate Weights

Use the conversion formula above. Typical results:

| Game Type | Expected CPU Weight | Expected GPU Weight |
|-----------|---------------------|---------------------|
| Esports/Competitive | 1.2-1.4 | 0.7-0.9 |
| AAA with RT | 0.8-1.0 | 1.3-1.5 |
| Simulation/Strategy | 1.2-1.5 | 0.9-1.1 |
| Balanced RPG | 1.0-1.2 | 1.0-1.2 |

### Step 4: Add Source Comment

Always document the source in the SQL:

```sql
('game-id', 'Game Name', 1.0, 1.2, 16, ...),
-- Source: Hardware Unboxed "Game Name CPU Scaling" 2024
```

### Step 5: Validate

After adding, check that:
1. cpu_weight + gpu_weight ≈ 2.0 (within 0.2)
2. The game appears correctly in the bottleneck calculator
3. Recommendations make sense (CPU-heavy games suggest CPU upgrades)

## Known Exceptions

Some games don't fit typical patterns:

### Cities: Skylines II
- **Expected**: CPU-heavy (city simulation)
- **Actual**: GPU-bound (1.0/1.3) due to poor optimization
- **Source**: Digital Foundry analysis showing GPU utilization issues

### Starfield
- **Expected**: GPU-heavy (Bethesda open world)
- **Actual**: Very CPU-bound (1.3/1.1) due to engine limitations
- **Source**: Hardware Unboxed CPU scaling tests

Always use benchmark data over assumptions about game genre.

## Fallback for Unknown Games

If no benchmark data exists for a game:

1. Check if the game has default weights (1.0/1.0)
2. Use genre-based estimates as starting point
3. Mark with `-- Source: Genre estimate, needs validation` comment
4. Create a backlog ticket to research when data becomes available

## File Locations

- **Weight data**: `supabase/seed/games.sql`
- **Resolution modifier**: `src/lib/resolution-modifier.ts`
- **Bottleneck calculation**: `src/lib/benchmarks.ts`
- **Analysis engine**: `src/lib/analysis/engine.ts`
