/**
 * Best Buy Price Sync Script for Smoothspec
 *
 * Usage:
 *   npx ts-node scripts/sync-bestbuy-prices.ts [type]
 *
 * Arguments:
 *   type - Optional: cpu, gpu, ram, storage, psu (syncs all if not specified)
 *
 * This script fetches current prices from Best Buy API and updates the database.
 * Run daily via cron or manually as needed.
 */

import { createClient } from '@supabase/supabase-js'
import { BestBuyClient, formatBestBuyPrice } from '../src/lib/bestbuy'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const bestbuy = new BestBuyClient()

// Rate limiting: 5 requests per second max
const DELAY_MS = 250

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface Component {
  id: string
  type: string
  brand: string
  model: string
}

async function syncComponentPrices(component: Component) {
  const searchQuery = `${component.brand} ${component.model}`
  console.log(`Searching: ${searchQuery}`)

  try {
    let products

    switch (component.type) {
      case 'cpu':
        products = await bestbuy.searchCPUs(searchQuery)
        break
      case 'gpu':
        products = await bestbuy.searchGPUs(searchQuery)
        break
      case 'ram':
        products = await bestbuy.searchRAM(searchQuery)
        break
      case 'storage':
        products = await bestbuy.searchStorage(searchQuery)
        break
      case 'psu':
        products = await bestbuy.searchPSU(searchQuery)
        break
      default:
        console.log(`  Unknown component type: ${component.type}`)
        return
    }

    if (products.length === 0) {
      console.log(`  No products found`)
      return
    }

    // Take the first matching product (usually best match)
    const product = products[0]
    const priceData = formatBestBuyPrice(product)

    console.log(`  Found: ${product.name} - $${priceData.price} (${priceData.inStock ? 'In Stock' : 'Out of Stock'})`)

    // Check if price exists
    const { data: existing } = await supabase
      .from('prices')
      .select('id')
      .eq('component_id', component.id)
      .eq('retailer', 'Best Buy')
      .single()

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('prices')
        .update({
          price: priceData.price,
          affiliate_url: priceData.affiliateUrl,
          in_stock: priceData.inStock,
          last_updated: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (error) {
        console.error(`  Error updating price:`, error)
      } else {
        console.log(`  ✓ Updated price`)
      }
    } else {
      // Insert new
      const { error } = await supabase.from('prices').insert({
        component_id: component.id,
        retailer: 'Best Buy',
        price: priceData.price,
        affiliate_url: priceData.affiliateUrl,
        in_stock: priceData.inStock,
      })

      if (error) {
        console.error(`  Error inserting price:`, error)
      } else {
        console.log(`  ✓ Added new price`)
      }
    }
  } catch (error) {
    console.error(`  API Error:`, error)
  }
}

async function syncPrices(componentType?: string) {
  console.log('Starting Best Buy price sync...')
  console.log('=' .repeat(60))

  // Fetch components
  let query = supabase
    .from('components')
    .select('id, type, brand, model')
    .order('type')
    .order('brand')

  if (componentType) {
    query = query.eq('type', componentType)
  }

  const { data: components, error } = await query

  if (error) {
    console.error('Error fetching components:', error)
    return
  }

  if (!components || components.length === 0) {
    console.log('No components found')
    return
  }

  console.log(`Found ${components.length} components to sync\n`)

  let synced = 0
  let failed = 0

  for (const component of components) {
    try {
      await syncComponentPrices(component)
      synced++
    } catch (e) {
      failed++
      console.error(`Failed to sync ${component.brand} ${component.model}:`, e)
    }

    // Rate limiting
    await sleep(DELAY_MS)
  }

  console.log('\n' + '='.repeat(60))
  console.log(`Sync complete: ${synced} synced, ${failed} failed`)
}

// CLI handling
const args = process.argv.slice(2)
const componentType = args[0]

if (componentType && !['cpu', 'gpu', 'ram', 'storage', 'psu'].includes(componentType)) {
  console.error('Invalid component type. Use: cpu, gpu, ram, storage, or psu')
  process.exit(1)
}

syncPrices(componentType).catch(console.error)
