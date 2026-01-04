/**
 * Manual Price Update Script for Smoothspec
 *
 * Usage:
 *   npx ts-node scripts/update-prices.ts
 *
 * This script provides a CLI for manually updating component prices
 * until the Best Buy API integration is complete.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface PriceUpdate {
  componentId: string
  retailer: string
  price: number
  affiliateUrl?: string
  inStock?: boolean
}

async function listComponents(type?: string) {
  let query = supabase
    .from('components')
    .select('id, type, brand, model')
    .order('type')
    .order('brand')
    .order('model')

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching components:', error)
    return
  }

  console.log('\nComponents:')
  console.log('=' .repeat(80))
  data?.forEach((c) => {
    console.log(`[${c.id.slice(0, 8)}] ${c.type.toUpperCase().padEnd(8)} ${c.brand} ${c.model}`)
  })
}

async function listPrices(componentId?: string) {
  let query = supabase
    .from('prices')
    .select(`
      id,
      price,
      retailer,
      in_stock,
      last_updated,
      component:components(brand, model)
    `)
    .order('last_updated', { ascending: false })

  if (componentId) {
    query = query.eq('component_id', componentId)
  }

  const { data, error } = await query.limit(50)

  if (error) {
    console.error('Error fetching prices:', error)
    return
  }

  console.log('\nRecent Prices:')
  console.log('='.repeat(100))
  data?.forEach((p: any) => {
    const status = p.in_stock ? '✓' : '✗'
    const component = p.component ? `${p.component.brand} ${p.component.model}` : 'Unknown'
    console.log(
      `${status} $${p.price.toFixed(2).padStart(8)} | ${p.retailer.padEnd(10)} | ${component.padEnd(30)} | ${new Date(p.last_updated).toLocaleDateString()}`
    )
  })
}

async function updatePrice(update: PriceUpdate) {
  const { data: existing } = await supabase
    .from('prices')
    .select('id')
    .eq('component_id', update.componentId)
    .eq('retailer', update.retailer)
    .single()

  if (existing) {
    // Update existing price
    const { error } = await supabase
      .from('prices')
      .update({
        price: update.price,
        affiliate_url: update.affiliateUrl,
        in_stock: update.inStock ?? true,
        last_updated: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (error) {
      console.error('Error updating price:', error)
    } else {
      console.log(`✓ Updated price for ${update.retailer}`)
    }
  } else {
    // Insert new price
    const { error } = await supabase.from('prices').insert({
      component_id: update.componentId,
      retailer: update.retailer,
      price: update.price,
      affiliate_url: update.affiliateUrl,
      in_stock: update.inStock ?? true,
    })

    if (error) {
      console.error('Error inserting price:', error)
    } else {
      console.log(`✓ Added new price for ${update.retailer}`)
    }
  }
}

async function bulkUpdateFromJson(filePath: string) {
  const fs = await import('fs')
  const content = fs.readFileSync(filePath, 'utf-8')
  const updates: PriceUpdate[] = JSON.parse(content)

  console.log(`Processing ${updates.length} price updates...`)

  for (const update of updates) {
    await updatePrice(update)
  }

  console.log('Done!')
}

// CLI handling
const args = process.argv.slice(2)
const command = args[0]

async function main() {
  switch (command) {
    case 'list':
      await listComponents(args[1])
      break
    case 'prices':
      await listPrices(args[1])
      break
    case 'update':
      if (args.length < 4) {
        console.log('Usage: update <component_id> <retailer> <price>')
        break
      }
      await updatePrice({
        componentId: args[1],
        retailer: args[2],
        price: parseFloat(args[3]),
      })
      break
    case 'bulk':
      if (!args[1]) {
        console.log('Usage: bulk <json_file>')
        break
      }
      await bulkUpdateFromJson(args[1])
      break
    default:
      console.log(`
Smoothspec Price Update Tool

Commands:
  list [type]           List all components (optionally filter by type: cpu, gpu, ram, storage, psu)
  prices [component_id] List recent prices (optionally filter by component)
  update <id> <retailer> <price>  Update a single price
  bulk <file.json>      Bulk update prices from JSON file

Examples:
  npx ts-node scripts/update-prices.ts list cpu
  npx ts-node scripts/update-prices.ts prices
  npx ts-node scripts/update-prices.ts update abc123 Amazon 299.99
  npx ts-node scripts/update-prices.ts bulk weekly-prices.json
      `)
  }
}

main().catch(console.error)
