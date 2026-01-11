/**
 * Verify popularity sorting is working correctly
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
  console.log('🔍 Verifying popularity sorting...\n')

  // Test 1: Check total game count
  const { count: totalCount } = await supabase
    .from('games')
    .select('*', { count: 'exact', head: true })

  console.log(`✅ Total games in database: ${totalCount}`)

  // Test 2: Check that all 20 new games exist
  const newGames = [
    'Marvel Rivals', 'Warframe', 'Path of Exile 2', 'Team Fortress 2',
    'HELLDIVERS 2', 'VRChat', 'Battlefield 2042', 'Delta Force',
    'War Thunder', 'Dead by Daylight', 'Project Zomboid', 'Monster Hunter Wilds',
    'Where Winds Meet', 'ELDEN RING NIGHTREIGN', 'ARK: Survival Ascended',
    'Enshrouded', 'Once Human', 'Left 4 Dead 2', 'Geometry Dash', 'Content Warning'
  ]

  console.log('\n📋 Checking new games...')
  for (const gameName of newGames) {
    const { data, error } = await supabase
      .from('games')
      .select('name, popularity_rank')
      .eq('name', gameName)
      .single()

    if (error || !data) {
      console.log(`  ❌ ${gameName} - NOT FOUND`)
    } else {
      console.log(`  ✅ ${gameName} - rank ${data.popularity_rank}`)
    }
  }

  // Test 3: Check sorting order (simulates useGames hook behavior)
  console.log('\n📊 Testing sort order (popularity_rank → name)...')
  const { data: sortedGames, error: sortError } = await supabase
    .from('games')
    .select('name, popularity_rank')
    .order('popularity_rank', { ascending: true })
    .order('name', { ascending: true })
    .limit(20)

  if (sortError) {
    console.error('❌ Error fetching sorted games:', sortError.message)
  } else {
    console.log('\nTop 20 games (as they will appear in the wizard):')
    sortedGames?.forEach((game, i) => {
      console.log(`  ${String(i + 1).padStart(2, '0')}. ${game.name.padEnd(35)} (rank: ${game.popularity_rank})`)
    })
  }

  // Test 4: Check that search would work (case-insensitive name filter)
  console.log('\n🔍 Testing search functionality...')
  const searchTests = ['team fortress', 'marvel', 'path of exile']

  for (const searchQuery of searchTests) {
    const { data: searchResults } = await supabase
      .from('games')
      .select('name')
      .ilike('name', `%${searchQuery}%`)

    console.log(`  Search "${searchQuery}": Found ${searchResults?.length || 0} results`)
    searchResults?.forEach(g => console.log(`    - ${g.name}`))
  }

  console.log('\n✅ Verification complete!')
}

main().catch(console.error)
