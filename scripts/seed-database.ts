/**
 * Database Seeder Script
 *
 * Reads SQL seed files and inserts data via Supabase client.
 * Usage: npx tsx scripts/seed-database.ts
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { join } from "path"

// Load environment variables from .env.local
import { config } from "dotenv"
config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface Component {
  type: string
  brand: string
  model: string
  family?: string
  release_year: number
  benchmark_score: number
  specs: Record<string, unknown>
}

/**
 * Derive CPU family from model name
 */
function getCpuFamily(brand: string, model: string): string {
  if (brand === "Intel") {
    // Core Ultra (latest naming scheme)
    if (model.includes("Core Ultra")) {
      return "Core Ultra"
    }

    // Standard Core i* pattern: i*-14*** = 14th Gen, i*-5*** = 5th Gen, etc.
    // This handles 5th-14th Gen with 2-digit generation numbers
    const match = model.match(/Core i[3579]-(\d{1,2})\d{3}/)
    if (match) {
      const gen = parseInt(match[1], 10)
      return `${gen}th Gen`
    }

    // Special case for 10th gen (already exists, keeping for compatibility)
    if (model.includes("10100") || model.includes("10400") || model.includes("10600") ||
        model.includes("10700") || model.includes("10900")) {
      return "10th Gen"
    }
  } else if (brand === "AMD") {
    // AMD Ryzen: Ryzen * 9*** = Ryzen 9000, Ryzen * 1*** = Ryzen 1000, etc.
    const match = model.match(/Ryzen [3579] (\d)\d{3}/)
    if (match) {
      const series = match[1]
      return `Ryzen ${series}000`
    }

    // APUs with G suffix (desktop versions)
    if (model.match(/Ryzen [3579] \d{4}G/)) {
      const aMatch = model.match(/Ryzen [3579] (\d)\d{3}G/)
      if (aMatch) {
        return `Ryzen ${aMatch[1]}000`
      }
    }

    // FX series
    if (model.startsWith("FX-")) {
      return "FX Series"
    }

    // A-Series APUs
    if (model.startsWith("A10-") || model.startsWith("A8-") || model.startsWith("A6-")) {
      return "A-Series"
    }
  }
  return "Other"
}

/**
 * Derive GPU family/series from model name
 */
function getGpuFamily(brand: string, model: string): string {
  if (brand === "NVIDIA") {
    // RTX 50 series (Blackwell - 2025-2026)
    if (model.match(/RTX 50[5-9]0/)) {
      return "RTX 50 Series"
    }
    // RTX 40 series (Ada Lovelace)
    if (model.match(/RTX 40[5-9]0/)) {
      return "RTX 40 Series"
    }
    // RTX 30 series (Ampere)
    if (model.match(/RTX 30[5-9]0/)) {
      return "RTX 30 Series"
    }
    // RTX 20 series (Turing)
    if (model.match(/RTX 20[6-8]0/)) {
      return "RTX 20 Series"
    }
    // GTX 16 series (Turing)
    if (model.match(/GTX 16[3-6]0/)) {
      return "GTX 16 Series"
    }
    // GTX 10 series (Pascal)
    if (model.match(/GTX 10[0-8]0/)) {
      return "GTX 10 Series"
    }
    // GTX 900 series (Maxwell)
    if (model.match(/GTX 9[5-8]0/)) {
      return "GTX 900 Series"
    }
    // GTX 700 series (Kepler)
    if (model.match(/GTX 7[5-9]0/)) {
      return "GTX 700 Series"
    }
    // GTX 600 series (Kepler)
    if (model.match(/GTX 6[5-9]0/)) {
      return "GTX 600 Series"
    }
    // GTX 500 series (Fermi)
    if (model.match(/GTX 5[5-9]0/)) {
      return "GTX 500 Series"
    }
    // GTX 400 series (Fermi)
    if (model.match(/GTX 4[6-8]0/)) {
      return "GTX 400 Series"
    }
    // Titans (various eras)
    if (model.includes("Titan")) {
      return "Titan Series"
    }
  } else if (brand === "AMD") {
    // RX 7000 series (RDNA 3)
    if (model.match(/RX 7[6-9]00/)) {
      return "RX 7000 Series"
    }
    // RX 6000 series (RDNA 2)
    if (model.match(/RX 6[4-9]00/)) {
      return "RX 6000 Series"
    }
    // RX 5000 series (RDNA)
    if (model.match(/RX 5[4-7]00/)) {
      return "RX 5000 Series"
    }
    // RX Vega (GCN 5)
    if (model.includes("Vega") || model.includes("Radeon VII") || model.includes("Frontier Edition")) {
      return "RX Vega"
    }
    // RX 500 series (Polaris refresh)
    if (model.match(/RX 5[5-9]0/)) {
      return "RX 500 Series"
    }
    // RX 400 series (Polaris)
    if (model.match(/RX 4[6-8]0/)) {
      return "RX 400 Series"
    }
    // R9/R7 300 series (GCN 1-3)
    if (model.match(/R[79] [3][0-9]0/)) {
      return "R9/R7 300 Series"
    }
    // R9/R7 200 series (GCN 1-2)
    if (model.match(/R[79] 2[0-9]0/)) {
      return "R9/R7 200 Series"
    }
    // HD 7000 series (GCN 1)
    if (model.match(/HD 7[0-9]{3}/)) {
      return "HD 7000 Series"
    }
    // HD 6000 series (VLIW4)
    if (model.match(/HD 6[0-9]{3}/)) {
      return "HD 6000 Series"
    }
    // HD 5000 series (VLIW5)
    if (model.match(/HD 5[0-9]{3}/)) {
      return "HD 5000 Series"
    }
  } else if (brand === "Intel") {
    // Intel Arc (Xe HPG)
    if (model.includes("Arc")) {
      return "Arc"
    }
  }
  return "Other"
}

interface Game {
  name: string
  steam_id: string
  cpu_weight: number
  gpu_weight: number
  ram_requirement: number
  recommended_specs: Record<string, unknown>
}

function parseComponentsSql(sqlContent: string): Component[] {
  const components: Component[] = []
  const cleanedSql = sqlContent.replace(/--.*$/gm, "")

  const tupleRegex = /\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'(\{[\s\S]*?\})'::jsonb\s*\)/g

  let match
  while ((match = tupleRegex.exec(cleanedSql)) !== null) {
    const [, type, brand, model, releaseYear, benchmarkScore, specsJson] = match
    try {
      const specs = JSON.parse(specsJson)
      components.push({
        type,
        brand,
        model,
        release_year: parseInt(releaseYear, 10),
        benchmark_score: parseInt(benchmarkScore, 10),
        specs,
      })
    } catch (e) {
      console.error(`Failed to parse specs for ${brand} ${model}:`, e)
    }
  }

  return components
}

function parseGamesSql(sqlContent: string): Game[] {
  const games: Game[] = []
  const cleanedSql = sqlContent.replace(/--.*$/gm, "")

  const tupleRegex = /\(\s*'([^']+)'\s*,\s*'([^']*)'\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*(\d+)\s*,\s*'(\{[\s\S]*?\})'::jsonb\s*\)/g

  let match
  while ((match = tupleRegex.exec(cleanedSql)) !== null) {
    const [, name, steamId, cpuWeight, gpuWeight, ramReq, specsJson] = match
    try {
      const specs = JSON.parse(specsJson)
      games.push({
        name,
        steam_id: steamId,
        cpu_weight: parseFloat(cpuWeight),
        gpu_weight: parseFloat(gpuWeight),
        ram_requirement: parseInt(ramReq, 10),
        recommended_specs: specs,
      })
    } catch (e) {
      console.error(`Failed to parse specs for ${name}:`, e)
    }
  }

  return games
}

async function seedComponents(components: Component[], type: string) {
  console.log(`\nSeeding ${components.length} ${type}s...`)

  let inserted = 0
  let updated = 0
  let errors = 0

  for (const comp of components) {
    // Derive family based on component type
    const family = type === "cpu"
      ? getCpuFamily(comp.brand, comp.model)
      : type === "gpu"
        ? getGpuFamily(comp.brand, comp.model)
        : null

    // Check if exists
    const { data: existing } = await supabase
      .from("components")
      .select("id")
      .eq("type", comp.type)
      .eq("brand", comp.brand)
      .eq("model", comp.model)
      .single()

    if (existing) {
      // Update
      const { error } = await supabase
        .from("components")
        .update({
          release_year: comp.release_year,
          benchmark_score: comp.benchmark_score,
          specs: comp.specs,
          family,
        })
        .eq("id", existing.id)

      if (error) {
        console.error(`  Error updating ${comp.brand} ${comp.model}:`, error.message)
        errors++
      } else {
        updated++
      }
    } else {
      // Insert
      const { error } = await supabase.from("components").insert({
        ...comp,
        family,
      })

      if (error) {
        console.error(`  Error inserting ${comp.brand} ${comp.model}:`, error.message)
        errors++
      } else {
        inserted++
      }
    }
  }

  console.log(`  Inserted: ${inserted}, Updated: ${updated}, Errors: ${errors}`)
}

async function seedGames(games: Game[]) {
  console.log(`\nSeeding ${games.length} games...`)

  let inserted = 0
  let updated = 0
  let errors = 0

  for (const game of games) {
    // Check if exists
    const { data: existing } = await supabase
      .from("games")
      .select("id")
      .eq("name", game.name)
      .single()

    if (existing) {
      // Update
      const { error } = await supabase
        .from("games")
        .update({
          steam_id: game.steam_id,
          cpu_weight: game.cpu_weight,
          gpu_weight: game.gpu_weight,
          ram_requirement: game.ram_requirement,
          recommended_specs: game.recommended_specs,
        })
        .eq("id", existing.id)

      if (error) {
        console.error(`  Error updating ${game.name}:`, error.message)
        errors++
      } else {
        updated++
      }
    } else {
      // Insert
      const { error } = await supabase.from("games").insert(game)

      if (error) {
        console.error(`  Error inserting ${game.name}:`, error.message)
        errors++
      } else {
        inserted++
      }
    }
  }

  console.log(`  Inserted: ${inserted}, Updated: ${updated}, Errors: ${errors}`)
}

async function main() {
  console.log("SmoothSpec Database Seeder")
  console.log("==========================")
  console.log(`Using Supabase URL: ${supabaseUrl}`)
  console.log(`Using key type: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "service_role" : "anon"}`)

  const seedDir = join(process.cwd(), "supabase", "seed")

  // Seed CPUs
  const cpusSql = readFileSync(join(seedDir, "cpus.sql"), "utf-8")
  const cpus = parseComponentsSql(cpusSql)
  await seedComponents(cpus, "cpu")

  // Seed GPUs
  const gpusSql = readFileSync(join(seedDir, "gpus.sql"), "utf-8")
  const gpus = parseComponentsSql(gpusSql)
  await seedComponents(gpus, "gpu")

  // Seed Games
  const gamesSql = readFileSync(join(seedDir, "games.sql"), "utf-8")
  const games = parseGamesSql(gamesSql)
  await seedGames(games)

  // Verify counts
  console.log("\n=== Verification ===")
  const { count: cpuCount } = await supabase.from("components").select("*", { count: "exact", head: true }).eq("type", "cpu")
  const { count: gpuCount } = await supabase.from("components").select("*", { count: "exact", head: true }).eq("type", "gpu")
  const { count: gameCount } = await supabase.from("games").select("*", { count: "exact", head: true })

  console.log(`CPUs in database: ${cpuCount}`)
  console.log(`GPUs in database: ${gpuCount}`)
  console.log(`Games in database: ${gameCount}`)

  console.log("\nDone!")
}

main().catch((err) => {
  console.error("Error:", err.message)
  process.exit(1)
})
