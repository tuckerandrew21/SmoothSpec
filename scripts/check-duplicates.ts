/**
 * Check for and remove duplicate games
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('🔍 Checking for duplicate games...\n')

  // Get all games
  const { data: allGames, error } = await supabase
    .from('games')
    .select('id, name, steam_id')
    .order('name')

  if (error) {
    console.error('❌ Error fetching games:', error.message)
    process.exit(1)
  }

  // Find duplicates by name
  const nameMap = new Map<string, any[]>()

  for (const game of allGames!) {
    const existing = nameMap.get(game.name) || []
    existing.push(game)
    nameMap.set(game.name, existing)
  }

  const duplicates = Array.from(nameMap.entries())
    .filter(([_, games]) => games.length > 1)

  if (duplicates.length === 0) {
    console.log('✅ No duplicate games found!')
    return
  }

  console.log(`⚠️  Found ${duplicates.length} duplicate games:\n`)

  for (const [name, games] of duplicates) {
    console.log(`  ${name}:`)
    games.forEach((g, i) => {
      console.log(`    ${i + 1}. ID: ${g.id}, Steam ID: ${g.steam_id}`)
    })

    // Keep the first one, delete the rest
    const toDelete = games.slice(1).map(g => g.id)

    if (toDelete.length > 0) {
      console.log(`  🗑️  Deleting ${toDelete.length} duplicate(s)...`)

      const { error: deleteError } = await supabase
        .from('games')
        .delete()
        .in('id', toDelete)

      if (deleteError) {
        console.error(`  ❌ Error deleting duplicates for ${name}:`, deleteError.message)
      } else {
        console.log(`  ✅ Deleted duplicates for ${name}`)
      }
    }
    console.log()
  }

  // Verify final count
  const { count } = await supabase
    .from('games')
    .select('*', { count: 'exact', head: true })

  console.log(`\n✅ Final game count: ${count}`)
}

main().catch(console.error)
