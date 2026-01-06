/**
 * PCPartPicker Data Import Script
 *
 * Imports pricing data from the docyx/pc-part-dataset GitHub repository
 * into the Supabase pcpartpicker_prices table.
 *
 * Usage:
 *   npx ts-node scripts/import-pcpartpicker.ts
 *
 * Environment variables required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const BASE_URL =
  "https://raw.githubusercontent.com/docyx/pc-part-dataset/main/data/json"

// Dataset file mappings
const CATEGORY_FILES: Record<string, string> = {
  gpu: "video-card.json",
  cpu: "cpu.json",
  ram: "memory.json",
  storage: "internal-hard-drive.json",
  psu: "power-supply.json",
}

// Type definitions for raw data from PCPartPicker dataset
interface RawGPU {
  name: string
  price: number | null
  chipset: string
  memory: number
  core_clock: number | null
  boost_clock: number | null
  color: string | null
  length: number | null
}

interface RawCPU {
  name: string
  price: number | null
  core_count: number
  core_clock: number | null
  boost_clock: number | null
  microarchitecture: string | null
  tdp: number | null
  graphics: string | null
  smt: boolean
}

interface RawRAM {
  name: string
  price: number | null
  speed: [number, number] | null // [DDR version, MHz]
  modules: [number, number] | null // [count, GB per module]
  price_per_gb: number | null
  color: string | null
  first_word_latency: number | null
  cas_latency: number | null
}

interface RawStorage {
  name: string
  price: number | null
  capacity: number
  price_per_gb: number | null
  type: string // "SSD" or RPM value like "7200 RPM"
  cache: number | null
  form_factor: string | null
  interface: string | null
}

interface RawPSU {
  name: string
  price: number | null
  type: string | null
  efficiency: string | null
  wattage: number
  modular: string | boolean | null
  color: string | null
}

interface PCPartPickerPrice {
  category: string
  name: string
  price: number | null
  specs: Record<string, unknown>
  chipset: string | null
}

async function fetchJSON<T>(url: string): Promise<T[]> {
  console.log(`  Fetching ${url}...`)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }
  return response.json()
}

function transformGPU(item: RawGPU): PCPartPickerPrice {
  return {
    category: "gpu",
    name: item.name,
    price: item.price,
    chipset: item.chipset,
    specs: {
      memory_gb: item.memory,
      core_clock_mhz: item.core_clock,
      boost_clock_mhz: item.boost_clock,
      length_mm: item.length,
    },
  }
}

function transformCPU(item: RawCPU): PCPartPickerPrice {
  // Extract chipset-like identifier from name (e.g., "Ryzen 7 7800X3D" or "Core i7-14700K")
  const chipset = item.name
    .replace(/^AMD\s+/, "")
    .replace(/^Intel\s+/, "")
    .trim()

  return {
    category: "cpu",
    name: item.name,
    price: item.price,
    chipset: chipset,
    specs: {
      core_count: item.core_count,
      core_clock_ghz: item.core_clock,
      boost_clock_ghz: item.boost_clock,
      microarchitecture: item.microarchitecture,
      tdp_w: item.tdp,
      integrated_graphics: item.graphics,
      smt: item.smt,
    },
  }
}

function transformRAM(item: RawRAM): PCPartPickerPrice {
  // Create a chipset-like identifier: "DDR5-6000 32GB (2x16GB)"
  const ddrVersion = item.speed?.[0] ? `DDR${item.speed[0]}` : "DDR"
  const mhz = item.speed?.[1] || 0
  const moduleCount = item.modules?.[0] || 0
  const moduleSize = item.modules?.[1] || 0
  const totalGB = moduleCount * moduleSize
  const chipset = `${ddrVersion}-${mhz} ${totalGB}GB (${moduleCount}x${moduleSize}GB)`

  return {
    category: "ram",
    name: item.name,
    price: item.price,
    chipset: chipset,
    specs: {
      ddr_version: item.speed?.[0],
      speed_mhz: item.speed?.[1],
      module_count: item.modules?.[0],
      module_size_gb: item.modules?.[1],
      total_gb: totalGB,
      price_per_gb: item.price_per_gb,
      cas_latency: item.cas_latency,
      first_word_latency_ns: item.first_word_latency,
    },
  }
}

function transformStorage(item: RawStorage): PCPartPickerPrice {
  // Safely get string values (dataset may have non-string values)
  const formFactor = typeof item.form_factor === "string" ? item.form_factor : ""
  const interfaceType = typeof item.interface === "string" ? item.interface : ""

  // Determine if SSD or HDD
  const isSSD =
    item.type === "SSD" ||
    formFactor.includes("M.2") ||
    interfaceType.includes("NVMe")
  const storageType = isSSD ? "SSD" : "HDD"

  // Create chipset-like identifier: "1TB NVMe SSD" or "2TB 7200RPM HDD"
  const capacityStr =
    item.capacity >= 1000
      ? `${(item.capacity / 1000).toFixed(0)}TB`
      : `${item.capacity}GB`
  const nvmeStr = interfaceType.includes("NVMe") ? "NVMe " : ""
  const chipset = `${capacityStr} ${nvmeStr}${storageType}`

  return {
    category: "storage",
    name: item.name,
    price: item.price,
    chipset: chipset,
    specs: {
      capacity_gb: item.capacity,
      type: storageType,
      form_factor: item.form_factor,
      interface: item.interface,
      cache_mb: item.cache,
      price_per_gb: item.price_per_gb,
    },
  }
}

function transformPSU(item: RawPSU): PCPartPickerPrice {
  // Create chipset-like identifier: "850W 80+ Gold"
  const efficiency = item.efficiency || ""
  const chipset = `${item.wattage}W ${efficiency}`.trim()

  return {
    category: "psu",
    name: item.name,
    price: item.price,
    chipset: chipset,
    specs: {
      wattage: item.wattage,
      efficiency: item.efficiency,
      modular: item.modular,
      type: item.type,
    },
  }
}

/**
 * Deduplicate items by name, keeping the one with the lowest price
 * (or first one if prices are equal/null)
 */
function deduplicateByName(items: PCPartPickerPrice[]): PCPartPickerPrice[] {
  const seen = new Map<string, PCPartPickerPrice>()

  for (const item of items) {
    const existing = seen.get(item.name)
    if (!existing) {
      seen.set(item.name, item)
    } else {
      // Keep the one with the lower price (prefer non-null prices)
      if (item.price !== null && (existing.price === null || item.price < existing.price)) {
        seen.set(item.name, item)
      }
    }
  }

  return Array.from(seen.values())
}

async function importCategory(
  category: string,
  file: string
): Promise<{ added: number; updated: number; skipped: number }> {
  const url = `${BASE_URL}/${file}`
  const stats = { added: 0, updated: 0, skipped: 0 }

  try {
    let items: PCPartPickerPrice[] = []

    switch (category) {
      case "gpu":
        const gpus = await fetchJSON<RawGPU>(url)
        items = gpus.map(transformGPU)
        break
      case "cpu":
        const cpus = await fetchJSON<RawCPU>(url)
        items = cpus.map(transformCPU)
        break
      case "ram":
        const rams = await fetchJSON<RawRAM>(url)
        items = rams.map(transformRAM)
        break
      case "storage":
        const storages = await fetchJSON<RawStorage>(url)
        items = storages.map(transformStorage)
        break
      case "psu":
        const psus = await fetchJSON<RawPSU>(url)
        items = psus.map(transformPSU)
        break
    }

    const originalCount = items.length
    items = deduplicateByName(items)
    const duplicatesRemoved = originalCount - items.length

    console.log(`  Found ${originalCount} ${category} items (${duplicatesRemoved} duplicates removed, ${items.length} unique)`)

    // Batch upsert in chunks of 500
    const BATCH_SIZE = 500
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE)

      const { error } = await supabase.from("pcpartpicker_prices").upsert(
        batch.map((item) => ({
          category: item.category,
          name: item.name,
          price: item.price,
          specs: item.specs,
          chipset: item.chipset,
          updated_at: new Date().toISOString(),
        })),
        {
          onConflict: "category,name",
          ignoreDuplicates: false,
        }
      )

      if (error) {
        console.error(`  Error upserting batch: ${error.message}`)
        stats.skipped += batch.length
      } else {
        stats.added += batch.length
      }
    }
  } catch (error) {
    console.error(`  Error importing ${category}: ${error}`)
  }

  return stats
}

async function main() {
  console.log("PCPartPicker Data Import")
  console.log("========================\n")

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "Error: Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    )
    process.exit(1)
  }

  const totalStats = { added: 0, updated: 0, skipped: 0 }

  for (const [category, file] of Object.entries(CATEGORY_FILES)) {
    console.log(`\nImporting ${category.toUpperCase()}...`)
    const stats = await importCategory(category, file)
    totalStats.added += stats.added
    totalStats.updated += stats.updated
    totalStats.skipped += stats.skipped
    console.log(
      `  Done: ${stats.added} processed, ${stats.skipped} skipped`
    )
  }

  console.log("\n========================")
  console.log("Import Complete!")
  console.log(`Total: ${totalStats.added} processed, ${totalStats.skipped} skipped`)
}

main().catch(console.error)
