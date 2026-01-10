/**
 * Best Buy Price Sync Script for Smoothspec
 *
 * Usage:
 *   npx tsx scripts/sync-bestbuy-prices.ts [type]
 *
 * Arguments:
 *   type - Optional: cpu, gpu, ram, storage, psu (syncs all if not specified)
 *
 * This script fetches current prices from Best Buy API and updates the database.
 * Also syncs Amazon/Newegg prices from PCPartPicker dataset.
 * Run daily via cron or GitHub Actions.
 *
 * Environment variables:
 *   BESTBUY_API_KEY - Required for Best Buy API
 *   NEXT_PUBLIC_SUPABASE_URL - Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

// Load .env.local for local development
import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import { BestBuyClient, formatBestBuyPrice } from '../src/lib/bestbuy'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

let bestbuy: BestBuyClient | null = null
try {
  bestbuy = new BestBuyClient()
} catch (e) {
  console.warn('Best Buy API key not configured - skipping Best Buy sync')
}

// Rate limiting: 5 requests per second max
const BASE_DELAY_MS = 250
const MAX_RETRIES = 3
const BACKOFF_MULTIPLIER = 2

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Fetch with exponential backoff for rate limit errors
 */
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = BASE_DELAY_MS
): Promise<T> {
  try {
    return await fn()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    const isRateLimit = message.includes('429') || message.includes('rate limit')

    if (retries > 0 && isRateLimit) {
      console.log(`  Rate limited, retrying in ${delay}ms...`)
      await sleep(delay)
      return fetchWithRetry(fn, retries - 1, delay * BACKOFF_MULTIPLIER)
    }
    throw error
  }
}

interface Component {
  id: string
  type: string
  brand: string
  model: string
}

/**
 * Sync Best Buy price for a component (with retry logic)
 */
async function syncBestBuyPrice(component: Component): Promise<boolean> {
  if (!bestbuy) return false

  const searchQuery = `${component.brand} ${component.model}`
  console.log(`[Best Buy] Searching: ${searchQuery}`)

  try {
    const products = await fetchWithRetry(async () => {
      switch (component.type) {
        case 'cpu':
          return bestbuy!.searchCPUs(searchQuery)
        case 'gpu':
          return bestbuy!.searchGPUs(searchQuery)
        case 'ram':
          return bestbuy!.searchRAM(searchQuery)
        case 'storage':
          return bestbuy!.searchStorage(searchQuery)
        case 'psu':
          return bestbuy!.searchPSU(searchQuery)
        default:
          return []
      }
    })

    if (products.length === 0) {
      console.log(`  No products found`)
      return false
    }

    // Take the first matching product (usually best match)
    const product = products[0]
    const priceData = formatBestBuyPrice(product)

    console.log(`  Found: ${product.name} - $${priceData.price} (${priceData.inStock ? 'In Stock' : 'Out of Stock'})`)

    // Upsert price
    const { error } = await supabase
      .from('prices')
      .upsert({
        component_id: component.id,
        retailer: 'Best Buy',
        price: priceData.price,
        affiliate_url: priceData.affiliateUrl,
        in_stock: priceData.inStock,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'component_id,retailer',
      })

    if (error) {
      console.error(`  Error upserting price:`, error)
      return false
    }

    console.log(`  ✓ Updated Best Buy price`)
    return true
  } catch (error) {
    console.error(`  API Error:`, error)
    return false
  }
}

/**
 * Sync Amazon/Newegg prices from PCPartPicker dataset
 */
async function syncPCPartPickerPrices(component: Component): Promise<{ amazon: boolean; newegg: boolean }> {
  const result = { amazon: false, newegg: false }

  // Build chipset search pattern based on component
  let chipsetPattern = ''
  if (component.type === 'cpu') {
    // Extract model number: "Core i7-14700K" -> "14700K", "Ryzen 7 7800X3D" -> "7800X3D"
    const modelMatch = component.model.match(/[0-9]+[A-Za-z0-9]*$/)
    chipsetPattern = modelMatch ? `%${modelMatch[0]}%` : `%${component.model}%`
  } else if (component.type === 'gpu') {
    // Extract GPU model: "GeForce RTX 4070" -> "4070", "Radeon RX 7800 XT" -> "7800 XT"
    const gpuMatch = component.model.match(/(RTX\s*)?(\d{4}(\s*(Ti|Super|XT|XTX|GRE))?)/i)
    chipsetPattern = gpuMatch ? `%${gpuMatch[0]}%` : `%${component.model}%`
  } else {
    chipsetPattern = `%${component.model}%`
  }

  // Get price from PCPartPicker dataset
  const { data: pcppPrices } = await supabase
    .from('pcpartpicker_prices')
    .select('price')
    .eq('category', component.type)
    .ilike('chipset', chipsetPattern)
    .not('price', 'is', null)
    .order('price', { ascending: true })
    .limit(1)

  if (!pcppPrices || pcppPrices.length === 0) {
    console.log(`  No PCPartPicker price found for ${component.brand} ${component.model}`)
    return result
  }

  const estimatedPrice = pcppPrices[0].price
  console.log(`  PCPartPicker estimate: $${estimatedPrice}`)

  // Upsert Amazon price
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(`${component.brand} ${component.model}`)}`
  const { error: amazonError } = await supabase
    .from('prices')
    .upsert({
      component_id: component.id,
      retailer: 'Amazon',
      price: estimatedPrice,
      affiliate_url: amazonUrl,
      in_stock: true,
      last_updated: new Date().toISOString(),
    }, {
      onConflict: 'component_id,retailer',
    })

  if (!amazonError) {
    result.amazon = true
    console.log(`  ✓ Updated Amazon price`)
  }

  // Upsert Newegg price
  const neweggUrl = `https://www.newegg.com/p/pl?d=${encodeURIComponent(`${component.brand} ${component.model}`)}`
  const { error: neweggError } = await supabase
    .from('prices')
    .upsert({
      component_id: component.id,
      retailer: 'Newegg',
      price: estimatedPrice,
      affiliate_url: neweggUrl,
      in_stock: true,
      last_updated: new Date().toISOString(),
    }, {
      onConflict: 'component_id,retailer',
    })

  if (!neweggError) {
    result.newegg = true
    console.log(`  ✓ Updated Newegg price`)
  }

  return result
}

/**
 * Sync all prices for a component
 */
async function syncComponentPrices(component: Component): Promise<SyncResult> {
  console.log(`\n${component.brand} ${component.model} (${component.type})`)

  const bestBuySuccess = await syncBestBuyPrice(component)
  const pcppResult = await syncPCPartPickerPrices(component)

  return {
    bestBuy: bestBuySuccess,
    amazon: pcppResult.amazon,
    newegg: pcppResult.newegg,
  }
}

interface SyncResult {
  bestBuy: boolean
  amazon: boolean
  newegg: boolean
}

async function syncPrices(componentType?: string) {
  console.log('Starting price sync...')
  console.log('='.repeat(60))
  console.log(`Best Buy API: ${bestbuy ? 'Enabled' : 'Disabled (no API key)'}`)
  console.log('Amazon/Newegg: PCPartPicker estimates')
  console.log('='.repeat(60))

  // Fetch components (only CPU and GPU for pricing)
  let query = supabase
    .from('components')
    .select('id, type, brand, model')
    .in('type', ['cpu', 'gpu'])
    .order('type')
    .order('brand')

  if (componentType) {
    query = query.eq('type', componentType)
  }

  const { data: components, error } = await query

  if (error) {
    console.error('Error fetching components:', error)
    process.exit(1)
  }

  if (!components || components.length === 0) {
    console.log('No components found')
    return
  }

  console.log(`Found ${components.length} components to sync\n`)

  const stats = {
    total: components.length,
    bestBuy: { success: 0, failed: 0 },
    amazon: { success: 0, failed: 0 },
    newegg: { success: 0, failed: 0 },
  }

  for (const component of components) {
    try {
      const result = await syncComponentPrices(component)

      if (result.bestBuy) stats.bestBuy.success++
      else stats.bestBuy.failed++

      if (result.amazon) stats.amazon.success++
      else stats.amazon.failed++

      if (result.newegg) stats.newegg.success++
      else stats.newegg.failed++
    } catch (e) {
      console.error(`Failed to sync ${component.brand} ${component.model}:`, e)
      stats.bestBuy.failed++
      stats.amazon.failed++
      stats.newegg.failed++
    }

    // Rate limiting between components
    await sleep(BASE_DELAY_MS)
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('SYNC SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total components: ${stats.total}`)
  console.log(`Best Buy:  ${stats.bestBuy.success} success, ${stats.bestBuy.failed} failed`)
  console.log(`Amazon:    ${stats.amazon.success} success, ${stats.amazon.failed} failed`)
  console.log(`Newegg:    ${stats.newegg.success} success, ${stats.newegg.failed} failed`)
  console.log('='.repeat(60))

  // Exit with error if too many failures (>50%)
  const totalFailures = stats.bestBuy.failed + stats.amazon.failed + stats.newegg.failed
  const totalAttempts = stats.total * 3
  if (totalFailures > totalAttempts * 0.5) {
    console.error('\n❌ Too many failures (>50%), exiting with error')
    process.exit(1)
  }

  console.log('\n✅ Sync complete')
}

// CLI handling
const args = process.argv.slice(2)
const componentType = args[0]

if (componentType && !['cpu', 'gpu', 'ram', 'storage', 'psu'].includes(componentType)) {
  console.error('Invalid component type. Use: cpu, gpu, ram, storage, or psu')
  process.exit(1)
}

syncPrices(componentType).catch(console.error)
