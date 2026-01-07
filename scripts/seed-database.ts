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
    // Intel: Core i*-14*** = 14th Gen, Core i*-13*** = 13th Gen, etc.
    const match = model.match(/Core i[3579]-(\d{2})\d{3}/)
    if (match) {
      const gen = parseInt(match[1], 10)
      return `${gen}th Gen`
    }
    // Older Intel (10th gen)
    if (model.includes("10100") || model.includes("10400") || model.includes("10600") || model.includes("10700") || model.includes("10900")) {
      return "10th Gen"
    }
  } else if (brand === "AMD") {
    // AMD Ryzen: Ryzen * 7*** = Ryzen 7000, Ryzen * 5*** = Ryzen 5000, etc.
    const match = model.match(/Ryzen [3579] (\d)\d{3}/)
    if (match) {
      const series = match[1]
      return `Ryzen ${series}000`
    }
    // Ryzen 3 3200G special case
    if (model.includes("3200G") || model.includes("3400G")) {
      return "Ryzen 3000"
    }
  }
  return "Other"
}

/**
 * Derive GPU family/series from model name
 */
function getGpuFamily(brand: string, model: string): string {
  if (brand === "NVIDIA") {
    // RTX 40 series
    if (model.match(/RTX 40[5-9]0/)) {
      return "RTX 40 Series"
    }
    // RTX 30 series
    if (model.match(/RTX 30[5-9]0/)) {
      return "RTX 30 Series"
    }
    // GTX 16 series
    if (model.match(/GTX 16[5-8]0/)) {
      return "GTX 16 Series"
    }
  } else if (brand === "AMD") {
    // RX 7000 series
    if (model.match(/RX 7[6-9]00/)) {
      return "RX 7000 Series"
    }
    // RX 6000 series
    if (model.match(/RX 6[4-9]00/)) {
      return "RX 6000 Series"
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
