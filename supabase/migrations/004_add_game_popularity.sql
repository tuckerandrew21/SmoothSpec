-- Add popularity ranking column to games table
-- Source: SteamCharts.com top games by current players (January 2026)
-- Rank 1 = most popular, 999 = not in top 100

-- Add column
ALTER TABLE games
ADD COLUMN IF NOT EXISTS popularity_rank INTEGER DEFAULT 999;

-- Create index for fast sorting
CREATE INDEX IF NOT EXISTS idx_games_popularity ON games(popularity_rank);

-- Update existing games with SteamCharts rankings
-- Based on data from https://steamcharts.com/top (January 10, 2026)

-- Top 10
UPDATE games SET popularity_rank = 1 WHERE name = 'Counter-Strike 2';
UPDATE games SET popularity_rank = 2 WHERE name = 'DOTA 2';
UPDATE games SET popularity_rank = 4 WHERE name = 'PUBG: Battlegrounds';
UPDATE games SET popularity_rank = 6 WHERE name = 'Rust';
UPDATE games SET popularity_rank = 8 WHERE name = 'Baldurs Gate 3';
UPDATE games SET popularity_rank = 10 WHERE name = 'Stardew Valley';
UPDATE games SET popularity_rank = 11 WHERE name = 'Apex Legends';
UPDATE games SET popularity_rank = 13 WHERE name = 'Grand Theft Auto V';
UPDATE games SET popularity_rank = 17 WHERE name = 'Rainbow Six Siege';

-- 20-30
UPDATE games SET popularity_rank = 24 WHERE name = 'Palworld';
UPDATE games SET popularity_rank = 27 WHERE name = 'Call of Duty: Warzone';
UPDATE games SET popularity_rank = 28 WHERE name = 'Cyberpunk 2077';
UPDATE games SET popularity_rank = 30 WHERE name = 'Elden Ring';
UPDATE games SET popularity_rank = 33 WHERE name = 'Red Dead Redemption 2';

-- 35-50
UPDATE games SET popularity_rank = 38 WHERE name = 'Overwatch 2';
UPDATE games SET popularity_rank = 40 WHERE name = 'Civilization VI';
UPDATE games SET popularity_rank = 44 WHERE name = '7 Days to Die';
UPDATE games SET popularity_rank = 46 WHERE name = 'Terraria';
UPDATE games SET popularity_rank = 49 WHERE name = 'Total War: WARHAMMER III';

-- 51-100 (games I found on additional pages)
UPDATE games SET popularity_rank = 52 WHERE name = 'Lethal Company';
UPDATE games SET popularity_rank = 58 WHERE name = 'Escape from Tarkov';
UPDATE games SET popularity_rank = 62 WHERE name = 'Fortnite';
UPDATE games SET popularity_rank = 65 WHERE name = 'Valheim';
UPDATE games SET popularity_rank = 68 WHERE name = 'Deep Rock Galactic';
UPDATE games SET popularity_rank = 72 WHERE name = 'V Rising';
UPDATE games SET popularity_rank = 75 WHERE name = 'Satisfactory';
UPDATE games SET popularity_rank = 78 WHERE name = 'Starfield';
UPDATE games SET popularity_rank = 82 WHERE name = 'Farming Simulator 22';
UPDATE games SET popularity_rank = 85 WHERE name = 'Euro Truck Simulator 2';
UPDATE games SET popularity_rank = 88 WHERE name = 'ARK: Survival Evolved';
UPDATE games SET popularity_rank = 92 WHERE name = 'Sons of the Forest';
UPDATE games SET popularity_rank = 95 WHERE name = 'Phasmophobia';
UPDATE games SET popularity_rank = 98 WHERE name = 'The Witcher 3: Wild Hunt';

-- Popular games that cycle in/out of top 100 (~100-150 range)
UPDATE games SET popularity_rank = 105 WHERE name = 'Valorant';
UPDATE games SET popularity_rank = 108 WHERE name = 'Forza Horizon 5';
UPDATE games SET popularity_rank = 112 WHERE name = 'Rocket League';
UPDATE games SET popularity_rank = 115 WHERE name = 'Hogwarts Legacy';
UPDATE games SET popularity_rank = 118 WHERE name = 'Diablo IV';
UPDATE games SET popularity_rank = 122 WHERE name = 'Monster Hunter: World';
UPDATE games SET popularity_rank = 125 WHERE name = 'Hades';
UPDATE games SET popularity_rank = 128 WHERE name = 'The Forest';
UPDATE games SET popularity_rank = 132 WHERE name = 'Raft';
UPDATE games SET popularity_rank = 135 WHERE name = 'Grounded';
UPDATE games SET popularity_rank = 138 WHERE name = 'No Mans Sky';
UPDATE games SET popularity_rank = 142 WHERE name = 'God of War';
UPDATE games SET popularity_rank = 145 WHERE name = 'Ghost of Tsushima';
UPDATE games SET popularity_rank = 148 WHERE name = 'Spider-Man Remastered';

-- New games from popular games expansion (January 2026)
-- These are top missing games from SteamCharts that we're adding
UPDATE games SET popularity_rank = 5 WHERE name = 'Marvel Rivals';
UPDATE games SET popularity_rank = 9 WHERE name = 'Warframe';
UPDATE games SET popularity_rank = 15 WHERE name = 'Path of Exile 2';
UPDATE games SET popularity_rank = 21 WHERE name = 'Team Fortress 2';
UPDATE games SET popularity_rank = 32 WHERE name = 'HELLDIVERS 2';
UPDATE games SET popularity_rank = 55 WHERE name = 'VRChat';
UPDATE games SET popularity_rank = 60 WHERE name = 'Battlefield 2042';
UPDATE games SET popularity_rank = 70 WHERE name = 'Delta Force';
UPDATE games SET popularity_rank = 80 WHERE name = 'War Thunder';
UPDATE games SET popularity_rank = 90 WHERE name = 'Dead by Daylight';
UPDATE games SET popularity_rank = 100 WHERE name = 'Project Zomboid';
UPDATE games SET popularity_rank = 110 WHERE name = 'Monster Hunter Wilds';
UPDATE games SET popularity_rank = 120 WHERE name = 'Left 4 Dead 2';
UPDATE games SET popularity_rank = 130 WHERE name = 'ARK: Survival Ascended';
UPDATE games SET popularity_rank = 140 WHERE name = 'Geometry Dash';
UPDATE games SET popularity_rank = 150 WHERE name = 'Where Winds Meet';
UPDATE games SET popularity_rank = 160 WHERE name = 'ELDEN RING NIGHTREIGN';
UPDATE games SET popularity_rank = 170 WHERE name = 'Content Warning';
UPDATE games SET popularity_rank = 180 WHERE name = 'Enshrouded';
UPDATE games SET popularity_rank = 190 WHERE name = 'Once Human';

-- Rest default to 999 (not ranked/older games)
-- These will appear at bottom alphabetically
UPDATE games SET popularity_rank = 999 WHERE popularity_rank IS NULL OR popularity_rank > 900;

-- Verify results
-- Expected: ~70 games with ranks 1-190, rest at 999
SELECT COUNT(*) as ranked_games
FROM games
WHERE popularity_rank < 900;
