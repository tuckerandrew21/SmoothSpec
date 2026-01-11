/**
 * Run migration directly using postgres library
 * This executes the 004_add_game_popularity.sql migration
 */

import postgres from 'postgres'
import * as fs from 'fs'
import * as path from 'path'

const connectionString = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', 'postgresql://postgres:') + '/postgres'

if (!connectionString) {
  console.error('❌ Missing DATABASE_URL or NEXT_PUBLIC_SUPABASE_URL')
  process.exit(1)
}

async function main() {
  console.log('🚀 Running migration 004_add_game_popularity.sql...\n')

  // Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/004_add_game_popularity.sql')
  const migrationSql = fs.readFileSync(migrationPath, 'utf-8')

  // Connect to database
  const sql = postgres(connectionString, {
    ssl: 'require',
    max: 1,
  })

  try {
    // Execute migration
    console.log('📝 Executing migration SQL...')
    await sql.unsafe(migrationSql)
    console.log('✅ Migration complete!\n')

    // Verify
    console.log('🔍 Verifying changes...')
    const results = await sql`
      SELECT name, popularity_rank
      FROM games
      WHERE popularity_rank < 900
      ORDER BY popularity_rank
      LIMIT 10
    `

    console.log('📊 Top 10 games by popularity:')
    results.forEach((game, i) => {
      console.log(`   ${i + 1}. ${game.name} (rank: ${game.popularity_rank})`)
    })

    const [{ count }] = await sql`
      SELECT COUNT(*) as count
      FROM games
      WHERE popularity_rank < 900
    `

    console.log(`\n✅ Total ranked games: ${count}`)
    console.log('\n🎉 Popular Games Expansion complete!')

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    if (error.message?.includes('already exists')) {
      console.log('\n⚠️  Column may already exist. Checking...')

      try {
        const [{ count }] = await sql`
          SELECT COUNT(*) as count
          FROM games
          WHERE popularity_rank IS NOT NULL
        `
        console.log(`✅ Found ${count} games with popularity_rank - migration already applied!`)
      } catch (e) {
        console.error('❌ Column does not exist')
      }
    }
  } finally {
    await sql.end()
  }
}

main().catch(console.error)
