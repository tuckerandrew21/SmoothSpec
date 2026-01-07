/**
 * PCPartPicker Pricing Gap Checker
 *
 * Compares seed data against PCPartPicker dataset to find:
 * - Components without price matches
 * - Naming inconsistencies
 * - Missing coverage
 *
 * Usage:
 *   npx tsx scripts/check-pricing-gaps.ts           # Basic report
 *   npx tsx scripts/check-pricing-gaps.ts --verbose # With suggestions
 *   npx tsx scripts/check-pricing-gaps.ts --json    # JSON output
 */

import { readFileSync } from "fs"
import { join } from "path"
import { parseComponentsSql } from "../src/lib/__tests__/utils/sql-parser"
import {
  matchCpuToDataset,
  matchGpuToDataset,
  findSuggestions,
  getUniqueGpuChipsets,
  getUniqueCpuModels,
  PCPartPickerCPU,
  PCPartPickerGPU,
  MatchResult,
  GapReport,
} from "../src/lib/__tests__/utils/pcpartpicker-matcher"

const BASE_URL =
  "https://raw.githubusercontent.com/docyx/pc-part-dataset/main/data/json"

async function fetchJSON<T>(filename: string): Promise<T[]> {
  const url = `${BASE_URL}/${filename}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  return response.json()
}

function buildReport(
  results: MatchResult[],
  pcppItems: Array<{ name: string; chipset?: string }>
): GapReport {
  const report: GapReport = {
    matched: [],
    unmatched: [],
    partialMatches: [],
    suggestions: [],
  }

  for (const result of results) {
    switch (result.confidence) {
      case "exact":
        report.matched.push(result)
        break
      case "partial":
        report.partialMatches.push(result)
        break
      case "none":
        report.unmatched.push(result)
        report.suggestions.push({
          seedModel: `${result.seedBrand} ${result.seedModel}`,
          possibleMatches: findSuggestions(result.seedModel, pcppItems),
        })
        break
    }
  }

  return report
}

function printReport(
  category: string,
  report: GapReport,
  totalCount: number,
  verbose: boolean
): void {
  const matchedCount = report.matched.length + report.partialMatches.length
  const exactCount = report.matched.length
  const partialCount = report.partialMatches.length

  console.log(`\n=== ${category} Matching Report ===`)
  console.log(`Total: ${totalCount}`)
  console.log(`Exact matches: ${exactCount}`)
  console.log(`Partial matches: ${partialCount}`)
  console.log(`Unmatched: ${report.unmatched.length}`)

  // Show partial matches (may need naming fixes)
  if (report.partialMatches.length > 0) {
    console.log("\nPartial matches (may need naming fixes):")
    for (const item of report.partialMatches) {
      console.log(`  ${item.seedBrand} ${item.seedModel}`)
      console.log(`    → matched: ${item.pcppChipset}`)
    }
  }

  // Show unmatched
  if (report.unmatched.length > 0) {
    console.log("\nUnmatched (no price available):")
    for (const item of report.unmatched) {
      console.log(`  - ${item.seedBrand} ${item.seedModel}`)
    }

    if (verbose && report.suggestions.length > 0) {
      console.log("\nSuggestions for unmatched:")
      for (const sugg of report.suggestions) {
        if (sugg.possibleMatches.length > 0) {
          console.log(`  ${sugg.seedModel}:`)
          for (const match of sugg.possibleMatches) {
            console.log(`    - ${match}`)
          }
        }
      }
    }
  }
}

async function main() {
  const verbose = process.argv.includes("--verbose")
  const jsonOutput = process.argv.includes("--json")
  const listChipsets = process.argv.includes("--list-chipsets")

  // Read seed files
  const seedDir = join(process.cwd(), "supabase", "seed")
  const cpusSql = readFileSync(join(seedDir, "cpus.sql"), "utf-8")
  const gpusSql = readFileSync(join(seedDir, "gpus.sql"), "utf-8")

  const seedCpus = parseComponentsSql(cpusSql)
  const seedGpus = parseComponentsSql(gpusSql)

  if (!jsonOutput) {
    console.log("Fetching PCPartPicker dataset...")
    console.log(`  Seed CPUs: ${seedCpus.length}`)
    console.log(`  Seed GPUs: ${seedGpus.length}`)
  }

  // Fetch PCPartPicker data
  const [pcppCpus, pcppGpus] = await Promise.all([
    fetchJSON<PCPartPickerCPU>("cpu.json"),
    fetchJSON<PCPartPickerGPU>("video-card.json"),
  ])

  if (!jsonOutput) {
    console.log(`  PCPartPicker CPUs: ${pcppCpus.length}`)
    console.log(`  PCPartPicker GPUs: ${pcppGpus.length}`)
  }

  // Optional: list available chipsets for debugging
  if (listChipsets) {
    console.log("\n=== Available GPU Chipsets ===")
    const gpuChipsets = getUniqueGpuChipsets(pcppGpus)
    gpuChipsets.forEach((c) => console.log(`  ${c}`))

    console.log("\n=== Available CPU Models ===")
    const cpuModels = getUniqueCpuModels(pcppCpus)
    cpuModels.forEach((c) => console.log(`  ${c}`))
    return
  }

  // Match CPUs
  const cpuResults = seedCpus.map((cpu) =>
    matchCpuToDataset(cpu.brand, cpu.model, pcppCpus)
  )
  const cpuReport = buildReport(
    cpuResults,
    pcppCpus.map((c) => ({
      name: c.name,
      chipset: c.name.replace(/^(AMD|Intel)\s+/i, "").trim(),
    }))
  )

  // Match GPUs
  const gpuResults = seedGpus.map((gpu) =>
    matchGpuToDataset(gpu.brand, gpu.model, pcppGpus)
  )
  const gpuReport = buildReport(gpuResults, pcppGpus)

  // Output
  if (jsonOutput) {
    const output = {
      cpu: {
        total: seedCpus.length,
        exact: cpuReport.matched.length,
        partial: cpuReport.partialMatches.length,
        unmatched: cpuReport.unmatched.length,
        details: cpuReport,
      },
      gpu: {
        total: seedGpus.length,
        exact: gpuReport.matched.length,
        partial: gpuReport.partialMatches.length,
        unmatched: gpuReport.unmatched.length,
        details: gpuReport,
      },
    }
    console.log(JSON.stringify(output, null, 2))
    return
  }

  // Human-readable output
  printReport("CPU", cpuReport, seedCpus.length, verbose)
  printReport("GPU", gpuReport, seedGpus.length, verbose)

  // Summary
  const totalUnmatched =
    cpuReport.unmatched.length + gpuReport.unmatched.length
  const totalPartial =
    cpuReport.partialMatches.length + gpuReport.partialMatches.length

  console.log("\n=== Summary ===")
  if (totalUnmatched > 0) {
    console.log(`${totalUnmatched} component(s) have no price matches`)
  }
  if (totalPartial > 0) {
    console.log(`${totalPartial} component(s) have partial matches (review naming)`)
  }
  if (totalUnmatched === 0 && totalPartial === 0) {
    console.log("All components have exact price matches!")
  }

  // Exit with error if unmatched (useful for CI)
  if (totalUnmatched > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Error:", err.message)
  process.exit(1)
})
