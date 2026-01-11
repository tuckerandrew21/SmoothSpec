/**
 * Apply Popular Games Expansion Update
 *
 * This script:
 * 1. Inserts 20 new popular games into the database
 * 2. Adds popularity_rank column to games table
 * 3. Sets popularity rankings for all games
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('🚀 Starting Popular Games Expansion update...\n')

  // Step 1: Insert new games
  console.log('📝 Inserting 20 new popular games...')

  const games = [
      { name: 'Marvel Rivals', steam_id: '2767030', cpu_weight: 1.0, gpu_weight: 1.3, ram_requirement: 16, recommended_specs: { min_cpu: "Intel Core i5-6600K", rec_cpu: "Intel Core i7-9700", min_gpu: "GTX 1060", rec_gpu: "RTX 3060", notes: "GPU-heavy Unreal Engine 5 game, Lumen GI most taxing setting (-30% FPS)" }},
      { name: 'Warframe', steam_id: '230410', cpu_weight: 1.0, gpu_weight: 1.1, ram_requirement: 16, recommended_specs: { min_cpu: "Intel Core i7-860", rec_cpu: "Intel Core i5-6350HQ", min_gpu: "GTX 1050", rec_gpu: "GTX 1050 Ti", notes: "Well optimized, RTX 3060 shows 70% higher FPS in newer areas" }},
      { name: 'Path of Exile 2', steam_id: '2694490', cpu_weight: 1.2, gpu_weight: 1.2, ram_requirement: 16, recommended_specs: { min_cpu: "Intel Core i5-9400F", rec_cpu: "Intel Core i7-12700K", min_gpu: "RTX 2060", rec_gpu: "RTX 3080", notes: "Uses up to 12 threads, high CPU utilization, 9GB VRAM at 4K Ultra" }},
      { name: 'Team Fortress 2', steam_id: '440', cpu_weight: 1.3, gpu_weight: 0.9, ram_requirement: 8, recommended_specs: { min_cpu: "Intel Core 2 Duo E7500", rec_cpu: "Intel Core i7-3770", min_gpu: "GTX 550 Ti", rec_gpu: "GTX 660", notes: "Source engine, CPU-bound with 77% CPU scaling, multicore rendering helps" }},
      { name: 'HELLDIVERS 2', steam_id: '553850', cpu_weight: 1.2, gpu_weight: 1.1, ram_requirement: 8, recommended_specs: { min_cpu: "Intel Core i5-8600K", rec_cpu: "Intel Core i7-9700K", min_gpu: "GTX 1050 Ti", rec_gpu: "RTX 3070", notes: "Very CPU-intensive, 90% CPU usage, outdated engine" }},
      { name: 'VRChat', steam_id: '438100', cpu_weight: 1.4, gpu_weight: 0.8, ram_requirement: 8, recommended_specs: { min_cpu: "Intel Core i5-4590", rec_cpu: "Intel Core i7-8700K", min_gpu: "GTX 970", rec_gpu: "GTX 1660 SUPER", notes: "Mostly single-core bound, CPU performance more important than GPU" }},
      { name: 'Battlefield 2042', steam_id: '1517290', cpu_weight: 1.3, gpu_weight: 1.2, ram_requirement: 16, recommended_specs: { min_cpu: "Intel Core i5-6600K", rec_cpu: "Intel Core i7-10700K", min_gpu: "GTX 1050 Ti", rec_gpu: "RTX 3060", notes: "Very CPU demanding, 128-player battles stress CPU, memory latency matters" }},
      { name: 'Delta Force', steam_id: '2507950', cpu_weight: 1.1, gpu_weight: 1.2, ram_requirement: 16, recommended_specs: { min_cpu: "Intel Core i3-4150", rec_cpu: "Intel Core i5-6500", min_gpu: "GTX 960", rec_gpu: "GTX 1060", notes: "Moderately CPU-bound, cannot scale beyond 8 CPU cores" }},
      { name: 'War Thunder', steam_id: '236390', cpu_weight: 1.2, gpu_weight: 0.9, ram_requirement: 8, recommended_specs: { min_cpu: "Intel Core 2 Duo E6600", rec_cpu: "Intel Core i5-8400", min_gpu: "GTX 660", rec_gpu: "GTX 1060", notes: "Predominantly CPU-bound at 1080p/1440p, not very demanding overall" }},
      { name: 'Dead by Daylight', steam_id: '381210', cpu_weight: 1.2, gpu_weight: 0.9, ram_requirement: 8, recommended_specs: { min_cpu: "Intel Pentium G2020", rec_cpu: "Intel Core i3-4170", min_gpu: "GTX 760", rec_gpu: "GTX 1050", notes: "More CPU intensive than GPU, modest requirements" }},
      { name: 'Project Zomboid', steam_id: '108600', cpu_weight: 1.4, gpu_weight: 0.7, ram_requirement: 16, recommended_specs: { min_cpu: "Intel Core 2.77GHz quad-core", rec_cpu: "Intel Core i5-9600K", min_gpu: "Radeon HD 5450", rec_gpu: "Radeon RX 5700 XT", notes: "CPU load incredibly high, hundreds/thousands of zombies stress CPU" }},
      { name: 'Monster Hunter Wilds', steam_id: '2246340', cpu_weight: 1.0, gpu_weight: 1.3, ram_requirement: 32, recommended_specs: { min_cpu: "Intel Core i5-10600", rec_cpu: "Intel Core i7-12700K", min_gpu: "GTX 1660 Ti", rec_gpu: "RTX 3080", notes: "Mostly GPU-bound, needs modern 6+ thread CPU, optimizations planned Jan-Feb 2026" }},
      { name: 'Where Winds Meet', steam_id: '3564740', cpu_weight: 1.1, gpu_weight: 1.3, ram_requirement: 32, recommended_specs: { min_cpu: "AMD Ryzen 4 3600X", rec_cpu: "Intel Core i7-10700", min_gpu: "AMD RX 480", rec_gpu: "RTX 2070 SUPER", notes: "Favours NVIDIA hardware, supports DLSS 4/FSR 3.0/XeSS, traversal stutters" }},
      { name: 'ELDEN RING NIGHTREIGN', steam_id: '2622380', cpu_weight: 0.9, gpu_weight: 1.2, ram_requirement: 16, recommended_specs: { min_cpu: "Intel Core i5-10600", rec_cpu: "Intel Core i7-10700K", min_gpu: "GTX 1060", rec_gpu: "RTX 3060", notes: "60fps cap, doesn't properly utilize high-end CPUs, FromSoftware engine" }},
      { name: 'ARK: Survival Ascended', steam_id: '2399830', cpu_weight: 1.2, gpu_weight: 1.3, ram_requirement: 32, recommended_specs: { min_cpu: "Intel Core i7-6800K", rec_cpu: "Intel Core i5-10600K", min_gpu: "GTX 1080", rec_gpu: "RTX 3080", notes: "Unreal Engine 5 with Lumen/Nanite, heavy on both CPU and GPU" }},
      { name: 'Enshrouded', steam_id: '1203620', cpu_weight: 1.1, gpu_weight: 1.2, ram_requirement: 16, recommended_specs: { min_cpu: "Intel Core i5-6400", rec_cpu: "Intel Core i7-8700", min_gpu: "GTX 1060", rec_gpu: "RTX 2070 SUPER", notes: "GPU-bound at 1440p/4K, intermittent CPU stuttering, supports DLSS 4/FSR 3.1" }},
      { name: 'Once Human', steam_id: '2139460', cpu_weight: 1.2, gpu_weight: 1.1, ram_requirement: 16, recommended_specs: { min_cpu: "Intel Core i5-4460", rec_cpu: "Intel Core i7-7700", min_gpu: "GTX 750 Ti", rec_gpu: "GTX 1060", notes: "CPU bottlenecked at 1080p, unlimited FPS = 100% CPU usage, supports DLSS 3/FSR 2" }},
      { name: 'Left 4 Dead 2', steam_id: '550', cpu_weight: 1.3, gpu_weight: 0.7, ram_requirement: 8, recommended_specs: { min_cpu: "Intel Pentium 4 3.0GHz", rec_cpu: "Intel Core i5-4590", min_gpu: "ATI X800", rec_gpu: "GTX 660", notes: "Source engine, single-core bound, multicore rendering improves FPS by 47%" }},
      { name: 'Geometry Dash', steam_id: '322170', cpu_weight: 1.2, gpu_weight: 0.6, ram_requirement: 8, recommended_specs: { min_cpu: "Intel Pentium 4 1500MHz", rec_cpu: "Intel Celeron G1101", min_gpu: "GeForce 6200 LE", rec_gpu: "GTX 280", notes: "CPU intensive game, GT730 could give 144fps if CPU is good enough" }},
      { name: 'Content Warning', steam_id: '2881650', cpu_weight: 1.0, gpu_weight: 1.0, ram_requirement: 16, recommended_specs: { min_cpu: "Intel Core i5-3210M", rec_cpu: "Intel Core i5-2400", min_gpu: "GTX 1050 Ti", rec_gpu: "GTX 1060", notes: "Mid-range 2016 hardware sufficient, fairly accessible" }}
    ]

  for (const game of games) {
    const { error } = await supabase
      .from('games')
      .insert(game)

    if (error) {
      if (error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
        console.log(`⚠️  ${game.name} already exists, skipping...`)
      } else {
        console.error(`❌ Error inserting ${game.name}:`, error.message)
      }
    } else {
      console.log(`✅ Inserted ${game.name}`)
    }
  }

  console.log('\n✅ Successfully processed 20 games\n')

  // Step 2: Add popularity_rank column (via Supabase dashboard)
  console.log('⚠️  Note: You need to run the migration manually in Supabase Dashboard')
  console.log('   Go to SQL Editor and run: supabase/migrations/004_add_game_popularity.sql')
  console.log('   Or add the column manually: ALTER TABLE games ADD COLUMN IF NOT EXISTS popularity_rank INTEGER DEFAULT 999;')
  console.log('   Then run this script again to set rankings.\n')

  // Check if column exists by trying to query it
  const { data: testData, error: testError } = await supabase
    .from('games')
    .select('popularity_rank')
    .limit(1)

  if (testError) {
    console.log('❌ popularity_rank column does not exist yet.')
    console.log('   Please add it manually and re-run this script.\n')
    process.exit(1)
  }

  console.log('✅ popularity_rank column exists')

  // Step 4: Update popularity rankings for all games
  console.log('\n📝 Setting popularity rankings for all games...')

  const rankings = [
    // Existing games
    { name: 'Counter-Strike 2', rank: 1 },
    { name: 'DOTA 2', rank: 2 },
    { name: 'PUBG: Battlegrounds', rank: 4 },
    // New games
    { name: 'Marvel Rivals', rank: 5 },
    { name: 'Rust', rank: 6 },
    { name: 'Baldurs Gate 3', rank: 8 },
    { name: 'Warframe', rank: 9 },
    { name: 'Stardew Valley', rank: 10 },
    { name: 'Apex Legends', rank: 11 },
    { name: 'Grand Theft Auto V', rank: 13 },
    { name: 'Path of Exile 2', rank: 15 },
    { name: 'Rainbow Six Siege', rank: 17 },
    { name: 'Team Fortress 2', rank: 21 },
    { name: 'Palworld', rank: 24 },
    { name: 'Call of Duty: Warzone', rank: 27 },
    { name: 'Cyberpunk 2077', rank: 28 },
    { name: 'Elden Ring', rank: 30 },
    { name: 'HELLDIVERS 2', rank: 32 },
    { name: 'Red Dead Redemption 2', rank: 33 },
    { name: 'Overwatch 2', rank: 38 },
    { name: 'Civilization VI', rank: 40 },
    { name: '7 Days to Die', rank: 44 },
    { name: 'Terraria', rank: 46 },
    { name: 'Total War: WARHAMMER III', rank: 49 },
    { name: 'Lethal Company', rank: 52 },
    { name: 'VRChat', rank: 55 },
    { name: 'Escape from Tarkov', rank: 58 },
    { name: 'Battlefield 2042', rank: 60 },
    { name: 'Fortnite', rank: 62 },
    { name: 'Valheim', rank: 65 },
    { name: 'Deep Rock Galactic', rank: 68 },
    { name: 'Delta Force', rank: 70 },
    { name: 'V Rising', rank: 72 },
    { name: 'Satisfactory', rank: 75 },
    { name: 'Starfield', rank: 78 },
    { name: 'War Thunder', rank: 80 },
    { name: 'Farming Simulator 22', rank: 82 },
    { name: 'Euro Truck Simulator 2', rank: 85 },
    { name: 'ARK: Survival Evolved', rank: 88 },
    { name: 'Dead by Daylight', rank: 90 },
    { name: 'Sons of the Forest', rank: 92 },
    { name: 'Phasmophobia', rank: 95 },
    { name: 'The Witcher 3: Wild Hunt', rank: 98 },
    { name: 'Project Zomboid', rank: 100 },
    { name: 'Valorant', rank: 105 },
    { name: 'Forza Horizon 5', rank: 108 },
    { name: 'Monster Hunter Wilds', rank: 110 },
    { name: 'Rocket League', rank: 112 },
    { name: 'Hogwarts Legacy', rank: 115 },
    { name: 'Diablo IV', rank: 118 },
    { name: 'Left 4 Dead 2', rank: 120 },
    { name: 'Monster Hunter: World', rank: 122 },
    { name: 'Hades', rank: 125 },
    { name: 'The Forest', rank: 128 },
    { name: 'ARK: Survival Ascended', rank: 130 },
    { name: 'Raft', rank: 132 },
    { name: 'Grounded', rank: 135 },
    { name: 'No Mans Sky', rank: 138 },
    { name: 'Geometry Dash', rank: 140 },
    { name: 'God of War', rank: 142 },
    { name: 'Ghost of Tsushima', rank: 145 },
    { name: 'Spider-Man Remastered', rank: 148 },
    { name: 'Where Winds Meet', rank: 150 },
    { name: 'ELDEN RING NIGHTREIGN', rank: 160 },
    { name: 'Content Warning', rank: 170 },
    { name: 'Enshrouded', rank: 180 },
    { name: 'Once Human', rank: 190 }
  ]

  for (const { name, rank } of rankings) {
    const { error } = await supabase
      .from('games')
      .update({ popularity_rank: rank })
      .eq('name', name)

    if (error) {
      console.error(`❌ Error updating ${name}:`, error.message)
    }
  }

  console.log(`✅ Updated ${rankings.length} game rankings`)

  // Set default rank for unranked games
  const { error: defaultError } = await supabase
    .from('games')
    .update({ popularity_rank: 999 })
    .is('popularity_rank', null)

  if (!defaultError) {
    console.log('✅ Set default rank (999) for unranked games\n')
  }

  // Step 4: Verify the update
  console.log('🔍 Verifying changes...')

  const { data: rankedGames, error: countError } = await supabase
    .from('games')
    .select('name, popularity_rank', { count: 'exact' })
    .lt('popularity_rank', 900)
    .order('popularity_rank')
    .limit(10)

  if (countError) {
    console.error('❌ Error verifying:', countError)
  } else {
    console.log(`✅ Found ${rankedGames?.length || 0} ranked games`)
    console.log('\n📊 Top 10 games by popularity:')
    rankedGames?.forEach((game, i) => {
      console.log(`   ${i + 1}. ${game.name} (rank: ${game.popularity_rank})`)
    })
  }

  console.log('\n✅ Popular Games Expansion update complete!')
  console.log('\n🎮 Next steps:')
  console.log('   1. Test the wizard - games should be sorted by popularity')
  console.log('   2. Search should still work correctly')
  console.log('   3. All 20 new games should be selectable')
}

main().catch(console.error)
