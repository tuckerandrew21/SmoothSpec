# SmoothSpec Feature Ideas

## Mission Alignment

**Every feature should ask: "Does this help users make smarter purchasing decisions?"**

Features marked with **Mission: YES** directly answer "Where should my money go?"

---

## Completed

- ~~Copy Summary~~ ✅
- ~~Resolution Toggle~~ ✅
- ~~Component Age~~ ✅
- ~~"Save Your Money" Advice~~ ✅

---

## Architecture Notes (from last session)

### Key Decisions

- **Multi-resolution pre-compute**: Hook runs analysis for all 3 resolutions in parallel, UI just switches display (no loading flicker)
- **Component age color coding**: Green (<3y), Yellow (3-5y), Orange (>5y)
- **"Save Your Money" vs "No Upgrades in Budget"**: Two distinct states - truly good build (PiggyBank card with peripheral upsells) vs budget-limited (yellow warning)

### Files Modified

- [use-build-analysis.ts](../src/lib/hooks/use-build-analysis.ts) - Returns `{ analyses, loading, error, components }` with all 3 resolutions pre-computed
- [results-content.tsx](../src/components/results-content.tsx) - Resolution toggle, copy summary, component age badges, save-your-money card
- [comparison-content.tsx](../src/components/comparison-content.tsx) - Updated to use new hook API (`analysesA/analysesB`)
- [constants.ts](../src/lib/constants.ts) - Added `GOOD_BUILD_THRESHOLD`

### Implementation Notes for Next Features

**#1 Value Per Dollar Score** - Files to modify:

- `src/lib/analysis/recommendations.ts` - Calculate `valueScore = bottleneck_reduction / price`
- `src/components/results/upgrade-recommendation-card.tsx` - Display score and "Best Value" badge
- `src/types/analysis.ts` - Add `valueScore` to `UpgradeRecommendation` type

**#2 Per-Game Value Breakdown** - Files to modify:

- `src/lib/analysis/recommendations.ts` - Calculate per-game impact during recommendation generation
- `src/components/results/upgrade-recommendation-card.tsx` - Show game breakdown (expandable or tooltip)

**#3 Budget Filter** - Files to modify:

- `src/components/results-content.tsx` - Add slider/dropdown filter UI, filter recommendations client-side (no new API calls)

---

## High Impact / Low Effort (Do First)

### 1. Value Per Dollar Score (Bang for Buck)

**Effort:** 2-3 hours | **Area:** Results | **Mission: YES**

Show `bottleneck_reduction / price` as a visible score on each recommendation. "Best Value" badge on top pick. Already have the data, just need to calculate and display.

### 2. Per-Game Value Breakdown

**Effort:** 2 hours | **Area:** Results | **Mission: YES**

Show which games benefit most from each upgrade: "This GPU upgrade helps Cyberpunk (+25 FPS) but barely affects CS2 (+3 FPS)." Helps users who mostly play one game decide if it's worth it.

### 3. Budget Filter for Recommendations

**Effort:** 2-3 hours | **Area:** Results

Add a slider or dropdown to filter upgrade recommendations by max price. Logic: filter already-fetched recommendations by price threshold. No new API calls needed.

### 4. Popular Games Expansion

**Effort:** 1-2 hours | **Area:** Data Coverage

Add the top 20 Steam games by player count using SteamCharts data. Currently missing games = users can't analyze their actual builds. Use the existing methodology doc for CPU/GPU weights.

### 5. Quick Presets in Wizard

**Effort:** 2 hours | **Area:** Wizard

Add "Common Builds" dropdown with pre-filled popular configs:

- Budget Gaming (Ryzen 5 5600 + RTX 3060)
- Mid-range (i5-12400 + RTX 4070)
- High-end (Ryzen 7 7800X3D + RTX 4080)

Reduces friction for users who don't know exact specs.

### 6. Steam Hardware Survey Components

**Effort:** 3-4 hours | **Area:** Data Coverage

Add all components with >1% market share from Steam Hardware Survey. This covers 80%+ of actual user builds with minimal effort.

---

## High Impact / Medium Effort

### 7. Budget Split Advisor

**Effort:** 3-4 hours | **Area:** Results | **Mission: YES**

"With $500: spend $300 GPU + $150 CPU for best combined value" vs "$500 on GPU alone creates a new CPU bottleneck." Simulate multi-component upgrades and show which split maximizes value.

### 8. Upgrade Path Warning

**Effort:** 3-4 hours | **Area:** Results | **Mission: YES**

"If you upgrade GPU now, you'll hit a CPU bottleneck within 6 months for your games. Plan for ~$450 total." Prevents users from making isolated purchases that create new problems.

### 9. Diminishing Returns Visualization

**Effort:** 3 hours | **Area:** Results | **Mission: YES**

Show a curve: "Spending $200 gets you 80% of max improvement. The next $200 only adds 15% more." Helps users find their personal sweet spot.

### 10. Shareable Build URL

**Effort:** 4-5 hours | **Area:** Shareability

Encode build config in URL params (or short hash). Users can share links like `smoothspec.com/results?build=abc123`. No database needed if using compression.

### 11. "What If" Upgrade Simulator

**Effort:** 4-5 hours | **Area:** Results

Let users click an upgrade and instantly see recalculated bottleneck analysis. Currently they'd have to go back through wizard. Add a "simulate upgrade" button that swaps component and re-runs analysis client-side.

### 12. Game Performance Expectations

**Effort:** 3-4 hours | **Area:** Results

Show estimated FPS ranges per game based on component benchmarks. Even rough estimates ("60-80 FPS at 1440p Medium") are more actionable than just "you have a 15% bottleneck."

### 13. Component Autocomplete Improvements

**Effort:** 3-4 hours | **Area:** Wizard

Fuzzy search, showing "RTX 3060" when user types "3060". Handle common variations (Ti, Super, XT). Currently relies on exact matching.

### 14. Dark Mode

**Effort:** 2-3 hours | **Area:** Polish

If not already implemented, add dark mode toggle. High user demand for any modern web app.

### 15. Mobile-Responsive Results

**Effort:** 3-4 hours | **Area:** Polish

Ensure results page works well on mobile. Users often browse upgrade advice on phones.

---

## Medium Impact / Low Effort

### 16. "What You're Leaving on the Table"

**Effort:** 1-2 hours | **Area:** Results | **Mission: Partial**

Reframe bottleneck as lost performance: "Your GPU is leaving ~15 FPS on the table in Cyberpunk." Makes the cost of NOT upgrading tangible.

### 17. Bottleneck Visualization

**Effort:** 2 hours | **Area:** Results

Replace percentage text with visual bar charts showing CPU vs GPU utilization per game. More intuitive than "23% CPU bottleneck."

### 18. "Why This Recommendation" Tooltips

**Effort:** 2 hours | **Area:** Results

Add info icons explaining why each upgrade was suggested. "Recommended because your CPU bottlenecks 3/5 of your selected games."

### 19. RAM Upgrade Guidance

**Effort:** 1-2 hours | **Area:** Results

If RAM is flagged as insufficient, show specific recommendations (16GB DDR4-3200 for X games, 32GB for Y games).

### 20. Peripheral Recommendations

**Effort:** 2-3 hours | **Area:** Results

If build is balanced but user wants to spend money, suggest monitor/peripheral upgrades that match system capability.

---

## Lower Priority / Higher Effort

### 21. Used Market Suggestions

**Effort:** 6-8 hours | **Area:** Results | **Mission: YES (but hard)**

"Used RTX 3080 (~$300) outperforms new RTX 4060 ($299) for your games." Best bang-for-buck is often used. Requires integrating eBay/marketplace pricing APIs.

### 22. Build History (Local Storage)

**Effort:** 4-5 hours | **Area:** UX

Save analyzed builds to localStorage so users can return and compare. No auth needed.

### 23. Community Build Database

**Effort:** 8+ hours | **Area:** Feature

Let users submit and browse real-world builds with performance feedback. Requires moderation, database schema changes.

---

## Quick Reference Matrix (Mission-Aligned)

| #  | Feature                    | Impact | Effort | Mission? | Area    |
| -- | -------------------------- | ------ | ------ | -------- | ------- |
| 1  | Value Per Dollar Score     | High   | 2-3h   | **YES**  | Results |
| 2  | Per-Game Value Breakdown   | High   | 2h     | **YES**  | Results |
| 3  | Budget Filter              | High   | 2-3h   | -        | Results |
| 4  | Popular Games              | High   | 1-2h   | -        | Data    |
| 5  | Quick Presets              | High   | 2h     | -        | Wizard  |
| 6  | Steam Survey Components    | High   | 3-4h   | -        | Data    |
| 7  | Budget Split Advisor       | High   | 3-4h   | **YES**  | Results |
| 8  | Upgrade Path Warning       | High   | 3-4h   | **YES**  | Results |
| 9  | Diminishing Returns Viz    | High   | 3h     | **YES**  | Results |
| 10 | Shareable URL              | High   | 4-5h   | -        | Share   |
| 11 | Upgrade Simulator          | High   | 4-5h   | -        | Results |
| 12 | FPS Estimates              | High   | 3-4h   | -        | Results |
| 13 | Fuzzy Autocomplete         | Med    | 3-4h   | -        | Wizard  |
| 14 | Dark Mode                  | Med    | 2-3h   | -        | Polish  |
| 15 | Mobile Results             | Med    | 3-4h   | -        | Polish  |
| 16 | "Left on Table" Messaging  | Med    | 1-2h   | Partial  | Results |
| 17 | Bottleneck Viz             | Med    | 2h     | -        | Results |
| 18 | Why Tooltips               | Med    | 2h     | -        | Results |
| 19 | RAM Guidance               | Med    | 1-2h   | -        | Results |
| 20 | Peripheral Recs            | Med    | 2-3h   | -        | Results |
| 21 | Used Market Suggestions    | High   | 6-8h   | **YES**  | Results |
| 22 | Build History              | Low    | 4-5h   | -        | UX      |
| 23 | Community Builds           | Low    | 8+h    | -        | Feature |

---

## Recommended Starting Order (Mission-First)

**Next Up (Mission-Critical):**

1. **#1 Value Per Dollar Score** (2-3h) - THE core feature: bang for buck
2. **#2 Per-Game Value Breakdown** (2h) - Personalized value per game
3. **#3 Budget Filter** (2-3h) - Filter to what they can afford

**Then (Mission-Supporting):**

4. **#4 Popular Games** (2h) - More coverage = more users helped
5. **#7 Budget Split Advisor** (3-4h) - Multi-component optimization
6. **#8 Upgrade Path Warning** (3-4h) - Prevent bad purchases
7. **#9 Diminishing Returns Viz** (3h) - Show when to stop spending

This order prioritizes features that directly answer: "Where should my money go?"
