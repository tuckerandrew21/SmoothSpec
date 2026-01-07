-- Game Requirements Seed Data for Smoothspec
-- Popular Steam games with hardware weights
-- cpu_weight/gpu_weight: 0.5-1.5 scale (1.0 = balanced, >1 = more demanding on that component)

INSERT INTO games (name, steam_id, cpu_weight, gpu_weight, ram_requirement, recommended_specs) VALUES

-- GPU-Heavy AAA Games
('Cyberpunk 2077', '1091500', 0.9, 1.4, 16, '{
  "min_cpu": "Intel Core i7-6700",
  "rec_cpu": "Intel Core i7-12700",
  "min_gpu": "GTX 1060 6GB",
  "rec_gpu": "RTX 3070",
  "notes": "Very GPU intensive with ray tracing"
}'::jsonb),

('Hogwarts Legacy', '990080', 0.85, 1.4, 16, '{
  "min_cpu": "Intel Core i5-8400",
  "rec_cpu": "Intel Core i7-10700K",
  "min_gpu": "GTX 1080 Ti",
  "rec_gpu": "RTX 3090",
  "notes": "Open world with demanding visuals"
}'::jsonb),

('Red Dead Redemption 2', '1174180', 1.0, 1.3, 12, '{
  "min_cpu": "Intel Core i5-2500K",
  "rec_cpu": "Intel Core i7-4770K",
  "min_gpu": "GTX 1060 6GB",
  "rec_gpu": "RTX 2070",
  "notes": "Well optimized but still demanding"
}'::jsonb),

('Elden Ring', '1245620', 0.9, 1.2, 16, '{
  "min_cpu": "Intel Core i5-8400",
  "rec_cpu": "Intel Core i7-8700K",
  "min_gpu": "GTX 1060 3GB",
  "rec_gpu": "RTX 3070",
  "notes": "Open world action RPG"
}'::jsonb),

('Alan Wake 2', '2654510', 0.85, 1.5, 16, '{
  "min_cpu": "Intel Core i5-7600K",
  "rec_cpu": "Intel Core i7-12700",
  "min_gpu": "RTX 2060",
  "rec_gpu": "RTX 4070",
  "notes": "Extremely GPU demanding, requires RT"
}'::jsonb),

('Baldurs Gate 3', '1086940', 1.1, 1.1, 16, '{
  "min_cpu": "Intel Core i5-4690",
  "rec_cpu": "Intel Core i7-8700K",
  "min_gpu": "GTX 970",
  "rec_gpu": "RTX 3060 Ti",
  "notes": "Large RPG with complex scenes"
}'::jsonb),

-- CPU-Heavy Games (Simulation/Strategy)
('Microsoft Flight Simulator', '1250410', 1.5, 1.2, 32, '{
  "min_cpu": "Intel Core i5-8400",
  "rec_cpu": "Intel Core i7-9800X",
  "min_gpu": "GTX 970",
  "rec_gpu": "RTX 3080",
  "notes": "Very CPU intensive simulation"
}'::jsonb),

('Cities: Skylines II', '949230', 1.5, 1.0, 16, '{
  "min_cpu": "Intel Core i7-6700K",
  "rec_cpu": "Intel Core i5-12600K",
  "min_gpu": "GTX 970",
  "rec_gpu": "RTX 3080",
  "notes": "City simulation is very CPU bound"
}'::jsonb),

('Starfield', '1716740', 1.2, 1.3, 16, '{
  "min_cpu": "AMD Ryzen 5 2600X",
  "rec_cpu": "AMD Ryzen 5 3600X",
  "min_gpu": "GTX 1070",
  "rec_gpu": "RTX 2080",
  "notes": "Bethesda open world RPG"
}'::jsonb),

('Total War: WARHAMMER III', '1142710', 1.4, 1.1, 16, '{
  "min_cpu": "Intel Core i5-6600",
  "rec_cpu": "Intel Core i7-8700K",
  "min_gpu": "GTX 1660",
  "rec_gpu": "RTX 3070",
  "notes": "Large scale battles are CPU heavy"
}'::jsonb),

-- Competitive/Esports (Balanced, but benefit from high FPS)
('Counter-Strike 2', '730', 1.2, 0.9, 8, '{
  "min_cpu": "Intel Core i5-2400",
  "rec_cpu": "Intel Core i7",
  "min_gpu": "GTX 1050 Ti",
  "rec_gpu": "RTX 2070",
  "notes": "Competitive FPS, high FPS preferred"
}'::jsonb),

('Valorant', '', 1.3, 0.7, 8, '{
  "min_cpu": "Intel Core i3-4150",
  "rec_cpu": "Intel Core i5-9400F",
  "min_gpu": "Intel HD 4000",
  "rec_gpu": "GTX 1050 Ti",
  "notes": "Optimized for wide hardware range"
}'::jsonb),

('Apex Legends', '1172470', 1.1, 1.0, 8, '{
  "min_cpu": "Intel Core i3-6300",
  "rec_cpu": "Intel Core i5-3570K",
  "min_gpu": "GTX 640",
  "rec_gpu": "GTX 970",
  "notes": "Battle royale, benefits from CPU"
}'::jsonb),

('Fortnite', '', 1.0, 1.0, 16, '{
  "min_cpu": "Intel Core i3-3225",
  "rec_cpu": "Intel Core i5-7300U",
  "min_gpu": "Intel HD 4000",
  "rec_gpu": "GTX 960",
  "notes": "Well optimized for all hardware"
}'::jsonb),

-- VR Games (High requirements)
('Half-Life: Alyx', '546560', 1.1, 1.3, 12, '{
  "min_cpu": "Intel Core i5-7500",
  "rec_cpu": "Intel Core i5-10600",
  "min_gpu": "GTX 1060",
  "rec_gpu": "RTX 2070",
  "notes": "VR requires consistent high FPS"
}'::jsonb),

-- AAA Recent (2023-2024)
('Black Myth: Wukong', '2358720', 0.9, 1.4, 16, '{
  "min_cpu": "Intel Core i5-8400",
  "rec_cpu": "Intel Core i7-9700",
  "min_gpu": "GTX 1060 6GB",
  "rec_gpu": "RTX 3060 Ti",
  "notes": "Action RPG with demanding visuals"
}'::jsonb),

('Dragons Dogma 2', '2054970', 1.0, 1.3, 16, '{
  "min_cpu": "Intel Core i5-10600",
  "rec_cpu": "Intel Core i7-10700",
  "min_gpu": "GTX 1070",
  "rec_gpu": "RTX 3080",
  "notes": "Open world action RPG"
}'::jsonb),

('Diablo IV', '2344520', 0.9, 1.2, 16, '{
  "min_cpu": "Intel Core i5-4670K",
  "rec_cpu": "Intel Core i7-8700K",
  "min_gpu": "GTX 970",
  "rec_gpu": "RTX 3060 Ti",
  "notes": "ARPG with large environments"
}'::jsonb),

('Armored Core VI: Fires of Rubicon', '1888160', 0.9, 1.2, 12, '{
  "min_cpu": "Intel Core i5-2500K",
  "rec_cpu": "Intel Core i7-7700",
  "min_gpu": "GTX 1060 3GB",
  "rec_gpu": "RTX 2060",
  "notes": "Fast-paced mech combat"
}'::jsonb),

('Lies of P', '1627720', 0.9, 1.2, 16, '{
  "min_cpu": "Intel Core i5-7500",
  "rec_cpu": "Intel Core i7-8700",
  "min_gpu": "GTX 1050 Ti",
  "rec_gpu": "RTX 2060",
  "notes": "Soulslike action RPG"
}'::jsonb),

('Remnant II', '1282100', 1.0, 1.3, 16, '{
  "min_cpu": "Intel Core i5-7600",
  "rec_cpu": "Intel Core i7-8700",
  "min_gpu": "GTX 1060 5GB",
  "rec_gpu": "RTX 3060",
  "notes": "Co-op shooter with complex scenes"
}'::jsonb),

-- AAA Classics
('Horizon Zero Dawn', '1151640', 1.0, 1.2, 16, '{
  "min_cpu": "Intel Core i5-2500K",
  "rec_cpu": "Intel Core i7-4770K",
  "min_gpu": "GTX 1060 6GB",
  "rec_gpu": "RTX 2060",
  "notes": "Open world action adventure"
}'::jsonb),

('Death Stranding', '1190460', 0.9, 1.2, 8, '{
  "min_cpu": "Intel Core i5-3470",
  "rec_cpu": "Intel Core i7-3770",
  "min_gpu": "GTX 1050 3GB",
  "rec_gpu": "GTX 1060 6GB",
  "notes": "Well optimized open world"
}'::jsonb),

('God of War', '1593500', 0.9, 1.2, 8, '{
  "min_cpu": "Intel Core i5-2500K",
  "rec_cpu": "Intel Core i7-4770K",
  "min_gpu": "GTX 960",
  "rec_gpu": "GTX 1060 6GB",
  "notes": "Action adventure with stunning visuals"
}'::jsonb),

('The Witcher 3: Wild Hunt', '292030', 0.9, 1.2, 8, '{
  "min_cpu": "Intel Core i5-2500K",
  "rec_cpu": "Intel Core i7-3770",
  "min_gpu": "GTX 660",
  "rec_gpu": "GTX 770",
  "notes": "Open world RPG classic"
}'::jsonb),

('Monster Hunter: World', '582010', 1.1, 1.1, 8, '{
  "min_cpu": "Intel Core i5-4460",
  "rec_cpu": "Intel Core i7-3770",
  "min_gpu": "GTX 760",
  "rec_gpu": "GTX 1060",
  "notes": "Action RPG with detailed environments"
}'::jsonb),

('Sekiro: Shadows Die Twice', '814380', 1.0, 1.1, 8, '{
  "min_cpu": "Intel Core i3-2100",
  "rec_cpu": "Intel Core i5-2500K",
  "min_gpu": "GTX 760",
  "rec_gpu": "GTX 970",
  "notes": "Action adventure FromSoftware title"
}'::jsonb),

('Ghost of Tsushima', '2215430', 0.9, 1.2, 16, '{
  "min_cpu": "Intel Core i3-7100",
  "rec_cpu": "Intel Core i5-8600",
  "min_gpu": "GTX 960",
  "rec_gpu": "RTX 3060",
  "notes": "Open world samurai adventure"
}'::jsonb),

('Spider-Man Remastered', '1817070', 0.9, 1.2, 16, '{
  "min_cpu": "Intel Core i3-4160",
  "rec_cpu": "Intel Core i5-4670",
  "min_gpu": "GTX 950",
  "rec_gpu": "RTX 3070",
  "notes": "Open world superhero action"
}'::jsonb),

('Spider-Man: Miles Morales', '1817190', 0.9, 1.3, 16, '{
  "min_cpu": "Intel Core i3-4160",
  "rec_cpu": "Intel Core i5-8400",
  "min_gpu": "GTX 950",
  "rec_gpu": "RTX 3080",
  "notes": "More demanding than original"
}'::jsonb),

-- Esports / Competitive
('League of Legends', '', 1.1, 0.8, 4, '{
  "min_cpu": "Intel Core i3-530",
  "rec_cpu": "Intel Core i5-3300",
  "min_gpu": "Intel HD 4600",
  "rec_gpu": "GTX 560",
  "notes": "MOBA optimized for low-end systems"
}'::jsonb),

('Rocket League', '252950', 1.0, 0.9, 4, '{
  "min_cpu": "Intel Core 2 Duo E4600",
  "rec_cpu": "Intel Core i5 2400",
  "min_gpu": "GeForce GTX 260",
  "rec_gpu": "GTX 660",
  "notes": "Vehicle soccer game"
}'::jsonb),

('DOTA 2', '570', 1.2, 0.9, 4, '{
  "min_cpu": "Intel Core 2 Duo E7400",
  "rec_cpu": "Intel Core i5",
  "min_gpu": "GeForce 8600 GT",
  "rec_gpu": "GTX 650",
  "notes": "MOBA with complex particle effects"
}'::jsonb),

('Overwatch 2', '', 1.0, 1.0, 8, '{
  "min_cpu": "Intel Core i3",
  "rec_cpu": "Intel Core i7",
  "min_gpu": "GTX 600",
  "rec_gpu": "GTX 1060",
  "notes": "Team-based FPS"
}'::jsonb),

('Rainbow Six Siege', '359550', 1.2, 0.9, 8, '{
  "min_cpu": "Intel Core i3-560",
  "rec_cpu": "Intel Core i5-2500K",
  "min_gpu": "GTX 460",
  "rec_gpu": "GTX 670",
  "notes": "Tactical shooter benefits from CPU"
}'::jsonb),

('PUBG: Battlegrounds', '578080', 1.1, 1.1, 16, '{
  "min_cpu": "Intel Core i5-4430",
  "rec_cpu": "Intel Core i5-6600K",
  "min_gpu": "GTX 960 2GB",
  "rec_gpu": "GTX 1060 3GB",
  "notes": "Battle royale with large maps"
}'::jsonb),

('Call of Duty: Warzone', '', 1.0, 1.2, 16, '{
  "min_cpu": "Intel Core i3-6100",
  "rec_cpu": "Intel Core i5-6600K",
  "min_gpu": "GTX 670",
  "rec_gpu": "GTX 970",
  "notes": "Large scale battle royale"
}'::jsonb),

('Escape from Tarkov', '1422440', 1.3, 1.1, 16, '{
  "min_cpu": "Intel Core i5-2500K",
  "rec_cpu": "Intel Core i7-8700",
  "min_gpu": "GTX 660 2GB",
  "rec_gpu": "GTX 1060",
  "notes": "Hardcore tactical shooter, CPU heavy"
}'::jsonb),

-- Open World / Sandbox
('Grand Theft Auto V', '271590', 1.1, 1.1, 8, '{
  "min_cpu": "Intel Core i5 3470",
  "rec_cpu": "Intel Core i5 3470",
  "min_gpu": "GTX 660 2GB",
  "rec_gpu": "GTX 660 2GB",
  "notes": "Open world crime simulator"
}'::jsonb),

('No Mans Sky', '275850', 1.1, 1.1, 8, '{
  "min_cpu": "Intel Core i3",
  "rec_cpu": "Intel Core i5",
  "min_gpu": "GTX 480",
  "rec_gpu": "GTX 1060",
  "notes": "Procedural space exploration"
}'::jsonb),

('ARK: Survival Evolved', '346110', 1.2, 1.3, 16, '{
  "min_cpu": "Intel Core i5-2400",
  "rec_cpu": "Intel Core i5-4670K",
  "min_gpu": "GTX 670 2GB",
  "rec_gpu": "GTX 970 4GB",
  "notes": "Survival game with demanding graphics"
}'::jsonb),

('Rust', '252490', 1.2, 1.1, 16, '{
  "min_cpu": "Intel Core i7-3770",
  "rec_cpu": "Intel Core i7-4790K",
  "min_gpu": "GTX 670 2GB",
  "rec_gpu": "GTX 980",
  "notes": "Survival game with large player counts"
}'::jsonb),

('Valheim', '892970', 1.2, 0.9, 8, '{
  "min_cpu": "Intel Core 2 Quad Q6600",
  "rec_cpu": "Intel Core i5",
  "min_gpu": "GeForce GTX 500",
  "rec_gpu": "GeForce GTX 970",
  "notes": "Viking survival game"
}'::jsonb),

('Palworld', '1623730', 1.1, 1.2, 16, '{
  "min_cpu": "Intel Core i5-3570K",
  "rec_cpu": "Intel Core i9-9900K",
  "min_gpu": "GTX 1050 Ti",
  "rec_gpu": "RTX 2070",
  "notes": "Creature collection survival"
}'::jsonb),

('7 Days to Die', '251570', 1.2, 1.0, 12, '{
  "min_cpu": "Intel Core i5-2400",
  "rec_cpu": "Intel Core i7-6700",
  "min_gpu": "GTX 960 2GB",
  "rec_gpu": "GTX 1060 4GB",
  "notes": "Zombie survival sandbox"
}'::jsonb),

-- Simulation
('Euro Truck Simulator 2', '227300', 1.0, 0.9, 4, '{
  "min_cpu": "Intel Core 2 Duo E6750",
  "rec_cpu": "Intel Core i7",
  "min_gpu": "GeForce GTS 450",
  "rec_gpu": "GeForce GTX 760",
  "notes": "Truck driving simulator"
}'::jsonb),

('Farming Simulator 22', '1248130', 1.1, 1.0, 8, '{
  "min_cpu": "Intel Core i5-3330",
  "rec_cpu": "Intel Core i7-8700",
  "min_gpu": "GTX 660 Ti",
  "rec_gpu": "GTX 1060",
  "notes": "Farm management simulation"
}'::jsonb),

('American Truck Simulator', '270880', 1.0, 0.9, 6, '{
  "min_cpu": "Intel Core 2 Duo E6750",
  "rec_cpu": "Intel Core i7",
  "min_gpu": "GeForce GTS 450",
  "rec_gpu": "GeForce GTX 760",
  "notes": "American trucking simulator"
}'::jsonb),

('Planet Coaster 2', '2688950', 1.4, 1.1, 16, '{
  "min_cpu": "Intel Core i5-4590",
  "rec_cpu": "Intel Core i7-8700K",
  "min_gpu": "GTX 1060 6GB",
  "rec_gpu": "RTX 3070",
  "notes": "Theme park management sim"
}'::jsonb),

-- Indie / Popular
('Hades', '1145360', 0.8, 0.8, 4, '{
  "min_cpu": "Intel Core 2 Duo E6850",
  "rec_cpu": "Intel Core i5-750",
  "min_gpu": "GeForce GTX 460",
  "rec_gpu": "GeForce GTX 660",
  "notes": "Roguelike dungeon crawler"
}'::jsonb),

('Hades II', '1145350', 0.8, 0.9, 8, '{
  "min_cpu": "Intel Core i5-8400",
  "rec_cpu": "Intel Core i7-8700",
  "min_gpu": "GTX 960",
  "rec_gpu": "GTX 1660",
  "notes": "Sequel roguelike"
}'::jsonb),

('Stardew Valley', '413150', 0.7, 0.6, 4, '{
  "min_cpu": "Intel Core 2 Duo E4500",
  "rec_cpu": "Intel Core i3",
  "min_gpu": "Intel HD 3000",
  "rec_gpu": "GTX 550",
  "notes": "Farming simulation RPG"
}'::jsonb),

('Terraria', '105600', 0.7, 0.6, 4, '{
  "min_cpu": "Intel Core 2 Duo E5200",
  "rec_cpu": "Intel Core 2 Duo E5200",
  "min_gpu": "GeForce 8800 GT",
  "rec_gpu": "GeForce 9800 GT",
  "notes": "2D sandbox adventure"
}'::jsonb),

('Satisfactory', '526870', 1.2, 1.0, 16, '{
  "min_cpu": "Intel Core i5-3570K",
  "rec_cpu": "Intel Core i5-6600",
  "min_gpu": "GTX 760",
  "rec_gpu": "GTX 1060 6GB",
  "notes": "Factory building game"
}'::jsonb),

('Deep Rock Galactic', '548430', 0.9, 1.0, 8, '{
  "min_cpu": "Intel Core i5 2500K",
  "rec_cpu": "Intel Core i7 4790K",
  "min_gpu": "GTX 770",
  "rec_gpu": "GTX 970",
  "notes": "Co-op mining shooter"
}'::jsonb),

('Risk of Rain 2', '632360', 0.9, 0.9, 4, '{
  "min_cpu": "Intel Core i3-6100",
  "rec_cpu": "Intel Core i7-8700K",
  "min_gpu": "GTX 580",
  "rec_gpu": "GTX 680",
  "notes": "Roguelike third-person shooter"
}'::jsonb),

('Lethal Company', '1966720', 0.9, 0.9, 8, '{
  "min_cpu": "Intel Core i5-4590",
  "rec_cpu": "Intel Core i5-7400",
  "min_gpu": "GTX 1050 Ti",
  "rec_gpu": "GTX 1060",
  "notes": "Co-op horror"
}'::jsonb),

('Phasmophobia', '739630', 0.9, 1.0, 8, '{
  "min_cpu": "Intel Core i5-4590",
  "rec_cpu": "Intel Core i5-10600K",
  "min_gpu": "GTX 970",
  "rec_gpu": "RTX 2060",
  "notes": "Co-op ghost hunting"
}'::jsonb),

('V Rising', '1604030', 1.0, 1.0, 12, '{
  "min_cpu": "Intel Core i5-6600",
  "rec_cpu": "Intel Core i7-8700K",
  "min_gpu": "GTX 750 Ti",
  "rec_gpu": "GTX 1070",
  "notes": "Vampire survival game"
}'::jsonb),

('The Forest', '242760', 1.0, 1.1, 8, '{
  "min_cpu": "Intel Core 2 Duo E6850",
  "rec_cpu": "Intel Core i7-3770",
  "min_gpu": "GTX 560",
  "rec_gpu": "GTX 970",
  "notes": "Survival horror"
}'::jsonb),

('Sons of the Forest', '1326470', 1.1, 1.2, 16, '{
  "min_cpu": "Intel Core i5-8400",
  "rec_cpu": "Intel Core i7-8700K",
  "min_gpu": "GTX 1060 3GB",
  "rec_gpu": "RTX 3080",
  "notes": "Survival horror sequel"
}'::jsonb),

('Raft', '648800', 0.9, 0.9, 6, '{
  "min_cpu": "Intel Core i5 2.6GHz",
  "rec_cpu": "Intel Core i7 4790K",
  "min_gpu": "GeForce GTX 500",
  "rec_gpu": "GeForce GTX 700",
  "notes": "Ocean survival game"
}'::jsonb),

('Grounded', '962130', 1.0, 1.0, 8, '{
  "min_cpu": "Intel Core i3-3225",
  "rec_cpu": "Intel Core i5-7400",
  "min_gpu": "GTX 650",
  "rec_gpu": "GTX 1050 Ti",
  "notes": "Survival in a backyard"
}'::jsonb),

-- Racing
('Forza Horizon 5', '1551360', 1.0, 1.3, 16, '{
  "min_cpu": "Intel Core i5-4460",
  "rec_cpu": "Intel Core i5-8400",
  "min_gpu": "GTX 970",
  "rec_gpu": "RTX 3080",
  "notes": "Open world racing"
}'::jsonb),

('Forza Motorsport', '2440510', 1.1, 1.3, 16, '{
  "min_cpu": "Intel Core i5-8400",
  "rec_cpu": "Intel Core i7-10700K",
  "min_gpu": "GTX 1060 4GB",
  "rec_gpu": "RTX 3080",
  "notes": "Racing simulation"
}'::jsonb),

('Assetto Corsa Competizione', '805550', 1.2, 1.2, 8, '{
  "min_cpu": "Intel Core i5-4460",
  "rec_cpu": "Intel Core i7-7700K",
  "min_gpu": "GTX 1050 Ti",
  "rec_gpu": "GTX 1070",
  "notes": "GT racing simulation"
}'::jsonb),

-- Strategy
('Civilization VI', '289070', 1.4, 0.9, 8, '{
  "min_cpu": "Intel Core i3 2.5 GHz",
  "rec_cpu": "Intel Core i5 2.5 GHz",
  "min_gpu": "GTX 450",
  "rec_gpu": "GTX 770",
  "notes": "Turn-based strategy"
}'::jsonb),

('Age of Empires IV', '1466860', 1.3, 1.0, 16, '{
  "min_cpu": "Intel Core i5-6300U",
  "rec_cpu": "Intel Core i7-6600K",
  "min_gpu": "GTX 660",
  "rec_gpu": "RTX 2070",
  "notes": "Real-time strategy"
}'::jsonb),

('Crusader Kings III', '1158310', 1.4, 0.8, 8, '{
  "min_cpu": "Intel Core i3-2120",
  "rec_cpu": "Intel Core i5-4670K",
  "min_gpu": "GTX 460",
  "rec_gpu": "GTX 1650",
  "notes": "Grand strategy RPG"
}'::jsonb),

('Company of Heroes 3', '1677280', 1.3, 1.1, 16, '{
  "min_cpu": "Intel Core i5-6600",
  "rec_cpu": "Intel Core i9-9900K",
  "min_gpu": "GTX 970",
  "rec_gpu": "RTX 3080",
  "notes": "RTS with detailed graphics"
}'::jsonb);
