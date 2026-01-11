-- Game Requirements Seed Data for Smoothspec
-- Popular Steam games with hardware weights
-- cpu_weight/gpu_weight: 0.5-1.5 scale (1.0 = balanced, >1 = more demanding on that component)

INSERT INTO games (name, steam_id, cpu_weight, gpu_weight, ram_requirement, recommended_specs) VALUES

-- GPU-Heavy AAA Games
-- Source: GameGPU v2.1 benchmarks (2023), TechSpot (2020) - GPU scaling dominates, CPU upgrades show minimal FPS gains
('Cyberpunk 2077', '1091500', 0.9, 1.4, 16, '{
  "min_cpu": "Intel Core i7-6700",
  "rec_cpu": "Intel Core i7-12700",
  "min_gpu": "GTX 1060 6GB",
  "rec_gpu": "RTX 3070",
  "notes": "Very GPU intensive with ray tracing"
}'::jsonb),

-- Source: TechSpot GPU benchmarks (2023) - CPU-bound at 1080p/1440p, RTX 4090 capped at 136 FPS. DX12 driver overhead on Nvidia.
('Hogwarts Legacy', '990080', 1.1, 1.2, 16, '{
  "min_cpu": "Intel Core i5-8400",
  "rec_cpu": "Intel Core i7-10700K",
  "min_gpu": "GTX 1080 Ti",
  "rec_gpu": "RTX 3090",
  "notes": "CPU-bound at lower resolutions due to engine limitations"
}'::jsonb),

('Red Dead Redemption 2', '1174180', 1.0, 1.3, 12, '{
  "min_cpu": "Intel Core i5-2500K",
  "rec_cpu": "Intel Core i7-4770K",
  "min_gpu": "GTX 1060 6GB",
  "rec_gpu": "RTX 2070",
  "notes": "Well optimized but still demanding"
}'::jsonb),

-- Source: TechPowerUp, DSO Gaming (2024) - 40% GPU-idle at 1080p, 29% at 1440p. CPU-bound at lower res, GPU-bound at 4K.
('Elden Ring', '1245620', 1.1, 1.1, 16, '{
  "min_cpu": "Intel Core i5-8400",
  "rec_cpu": "Intel Core i7-8700K",
  "min_gpu": "GTX 1060 3GB",
  "rec_gpu": "RTX 3070",
  "notes": "Balanced, but CPU-bound at 1080p/1440p"
}'::jsonb),

('Alan Wake 2', '2654510', 0.85, 1.5, 16, '{
  "min_cpu": "Intel Core i5-7600K",
  "rec_cpu": "Intel Core i7-12700",
  "min_gpu": "RTX 2060",
  "rec_gpu": "RTX 4070",
  "notes": "Extremely GPU demanding, requires RT"
}'::jsonb),

-- Source: GamersNexus GPU benchmarks (2023) - High-end GPUs hit CPU ceiling at ~90 FPS, balanced workload
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

-- Source: GamersNexus benchmarks (2023) - Poorly optimized, RTX 4090 stuck at 40 FPS 4K/low. GPU-bound despite genre expectation.
-- RAM: Community reports severe stuttering with 16GB on large cities, 32GB recommended
('Cities: Skylines II', '949230', 1.0, 1.3, 32, '{
  "min_cpu": "Intel Core i7-6700K",
  "rec_cpu": "Intel Core i5-12600K",
  "min_gpu": "GTX 970",
  "rec_gpu": "RTX 3080",
  "notes": "GPU-bound due to poor optimization, excessive polygon count. 32GB RAM strongly recommended."
}'::jsonb),

-- Source: GamersNexus CPU benchmarks (2023) - Very CPU-bound even at 4K. Uses 8 cores efficiently. GPU underutilized.
('Starfield', '1716740', 1.3, 1.1, 16, '{
  "min_cpu": "AMD Ryzen 5 2600X",
  "rec_cpu": "AMD Ryzen 5 3600X",
  "min_gpu": "GTX 1070",
  "rec_gpu": "RTX 2080",
  "notes": "CPU-bound Bethesda engine, benefits from fast multi-core CPU"
}'::jsonb),

-- Source: TechPowerUp, KitGuru (2022) - Demanding on both CPU and GPU. Quad-core minimum, powerful GPU needed for Ultra.
('Total War: WARHAMMER III', '1142710', 1.3, 1.2, 16, '{
  "min_cpu": "Intel Core i5-6600",
  "rec_cpu": "Intel Core i7-8700K",
  "min_gpu": "GTX 1660",
  "rec_gpu": "RTX 3070",
  "notes": "Large scale battles demand both CPU and GPU"
}'::jsonb),

-- Competitive/Esports (Balanced, but benefit from high FPS)
-- Source: Steam community benchmarks, thinglabs (2024) - CPU bottleneck at 1080p, 200+ FPS requires fast CPU. 7800X3D shows 2x FPS over older CPUs.
('Counter-Strike 2', '730', 1.3, 0.8, 8, '{
  "min_cpu": "Intel Core i5-2400",
  "rec_cpu": "Intel Core i7",
  "min_gpu": "GTX 1050 Ti",
  "rec_gpu": "RTX 2070",
  "notes": "Competitive FPS, very CPU-bound at high FPS targets"
}'::jsonb),

('Valorant', '', 1.3, 0.7, 8, '{
  "min_cpu": "Intel Core i3-4150",
  "rec_cpu": "Intel Core i5-9400F",
  "min_gpu": "Intel HD 4000",
  "rec_gpu": "GTX 1050 Ti",
  "notes": "Optimized for wide hardware range"
}'::jsonb),

-- Source: GamersNexus, DSO Gaming - GPU-bound (unusual for competitive shooter). Scales well with resolution.
('Apex Legends', '1172470', 1.0, 1.1, 8, '{
  "min_cpu": "Intel Core i3-6300",
  "rec_cpu": "Intel Core i5-3570K",
  "min_gpu": "GTX 640",
  "rec_gpu": "GTX 970",
  "notes": "GPU-bound competitive shooter, scales well with resolution"
}'::jsonb),

-- Source: CapFrameX CPU tests, ComputerBase (2024) - GPU-bound at Epic settings, CPU-limited at low/performance mode. Balanced for typical play.
('Fortnite', '', 1.0, 1.0, 16, '{
  "min_cpu": "Intel Core i3-3225",
  "rec_cpu": "Intel Core i5-7300U",
  "min_gpu": "Intel HD 4000",
  "rec_gpu": "GTX 960",
  "notes": "Well optimized, balanced CPU/GPU scaling"
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

-- Source: TechPowerUp, DSO Gaming - GPU-bound title. Requires at least quad-core with HT, can use 8 cores.
('God of War', '1593500', 0.9, 1.3, 8, '{
  "min_cpu": "Intel Core i5-2500K",
  "rec_cpu": "Intel Core i7-4770K",
  "min_gpu": "GTX 960",
  "rec_gpu": "GTX 1060 6GB",
  "notes": "GPU-bound action adventure, well optimized"
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

-- RAM: Community consensus - 16GB is bare minimum, 32GB needed for Streets/Lighthouse maps without stuttering
('Escape from Tarkov', '1422440', 1.3, 1.1, 32, '{
  "min_cpu": "Intel Core i5-2500K",
  "rec_cpu": "Intel Core i7-8700",
  "min_gpu": "GTX 660 2GB",
  "rec_gpu": "GTX 1060",
  "notes": "Hardcore tactical shooter, CPU heavy. 32GB RAM recommended for large maps."
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

-- RAM: Community reports - 16GB causes frequent stuttering, 32GB recommended especially with mods
('ARK: Survival Evolved', '346110', 1.2, 1.3, 32, '{
  "min_cpu": "Intel Core i5-2400",
  "rec_cpu": "Intel Core i5-4670K",
  "min_gpu": "GTX 670 2GB",
  "rec_gpu": "GTX 970 4GB",
  "notes": "Survival game with demanding graphics. 32GB RAM recommended, especially with mods."
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
}'::jsonb),

-- NEW POPULAR GAMES - Top Missing from SteamCharts (January 2026)
-- These are the top 20 most-played Steam games not currently in the database
-- Source: https://steamcharts.com/top (January 10, 2026)

-- TOP 10 MISSING GAMES

-- #5 on Steam - GPU-heavy UE5 hero shooter
-- Sources: GameGPU, PC Optimized Settings, NotebookCheck (Dec 2024-Jan 2026)
('Marvel Rivals', '2767030', 1.0, 1.3, 16, '{
  "min_cpu": "Intel Core i5-6600K",
  "rec_cpu": "Intel Core i7-9700",
  "min_gpu": "GTX 1060",
  "rec_gpu": "RTX 3060",
  "notes": "GPU-heavy Unreal Engine 5 game, Lumen GI most taxing setting (-30% FPS)"
}'::jsonb),

-- #9 on Steam - Looter shooter with CPU lean for many players/effects
-- Sources: NotebookCheck, PC Optimized Settings (2024-2026)
('Warframe', '230410', 1.0, 1.1, 16, '{
  "min_cpu": "Intel Core i7-860",
  "rec_cpu": "Intel Core i5-6350HQ",
  "min_gpu": "GTX 1050",
  "rec_gpu": "GTX 1050 Ti",
  "notes": "Well optimized, RTX 3060 shows 70% higher FPS in newer areas"
}'::jsonb),

-- #15 on Steam - Uses 12 threads efficiently, both CPU and GPU intensive
-- Sources: GameGPU, DSO Gaming, PC Optimized Settings (Dec 2024-Jan 2026)
('Path of Exile 2', '2694490', 1.2, 1.2, 16, '{
  "min_cpu": "Intel Core i5-9400F",
  "rec_cpu": "Intel Core i7-12700K",
  "min_gpu": "RTX 2060",
  "rec_gpu": "RTX 3080",
  "notes": "Uses up to 12 threads, high CPU utilization, 9GB VRAM at 4K Ultra"
}'::jsonb),

-- #21 on Steam - Source engine, CPU-bound classic FPS
-- Sources: NotebookCheck, Steam discussions (2024-2026)
('Team Fortress 2', '440', 1.3, 0.9, 8, '{
  "min_cpu": "Intel Core 2 Duo E7500",
  "rec_cpu": "Intel Core i7-3770",
  "min_gpu": "GTX 550 Ti",
  "rec_gpu": "GTX 660",
  "notes": "Source engine, CPU-bound with 77% CPU scaling, multicore rendering helps"
}'::jsonb),

-- CPU-HEAVY / MULTIPLAYER GAMES

-- #32 on Steam - CPU-intensive co-op shooter with optimization issues
-- Sources: GameGPU, NotebookCheck, Steam discussions (2024-2026)
('HELLDIVERS 2', '553850', 1.2, 1.1, 8, '{
  "min_cpu": "Intel Core i5-8600K",
  "rec_cpu": "Intel Core i7-9700K",
  "min_gpu": "GTX 1050 Ti",
  "rec_gpu": "RTX 3070",
  "notes": "Very CPU-intensive, 90% CPU usage, outdated engine"
}'::jsonb),

-- Very CPU-bound social VR platform
-- Sources: VRChat Wiki, Community Benchmarks, Steam discussions (2024-2026)
('VRChat', '438100', 1.4, 0.8, 8, '{
  "min_cpu": "Intel Core i5-4590",
  "rec_cpu": "Intel Core i7-8700K",
  "min_gpu": "GTX 970",
  "rec_gpu": "GTX 1660 SUPER",
  "notes": "Mostly single-core bound, CPU performance more important than GPU"
}'::jsonb),

-- CPU-heavy 128-player battles
-- Sources: TechSpot, Tom''s Hardware, GameGPU (2021-2026)
('Battlefield 2042', '1517290', 1.3, 1.2, 16, '{
  "min_cpu": "Intel Core i5-6600K",
  "rec_cpu": "Intel Core i7-10700K",
  "min_gpu": "GTX 1050 Ti",
  "rec_gpu": "RTX 3060",
  "notes": "Very CPU demanding, 128-player battles stress CPU, memory latency matters"
}'::jsonb),

-- Moderate CPU-bound, UE5 shooter
-- Sources: GameGPU, PC Optimized Settings, NotebookCheck (2024-2026)
('Delta Force', '2507950', 1.1, 1.2, 16, '{
  "min_cpu": "Intel Core i3-4150",
  "rec_cpu": "Intel Core i5-6500",
  "min_gpu": "GTX 960",
  "rec_gpu": "GTX 1060",
  "notes": "Moderately CPU-bound, cannot scale beyond 8 CPU cores"
}'::jsonb),

-- CPU-bound vehicle combat MMO
-- Sources: PC Optimized Settings, OpenBenchmarking, HowManyFPS (2024-2026)
('War Thunder', '236390', 1.2, 0.9, 8, '{
  "min_cpu": "Intel Core 2 Duo E6600",
  "rec_cpu": "Intel Core i5-8400",
  "min_gpu": "GTX 660",
  "rec_gpu": "GTX 1060",
  "notes": "Predominantly CPU-bound at 1080p/1440p, not very demanding overall"
}'::jsonb),

-- CPU-intensive asymmetric horror
-- Sources: PCGameBenchmark, System Requirements Lab (2024-2026)
('Dead by Daylight', '381210', 1.2, 0.9, 8, '{
  "min_cpu": "Intel Pentium G2020",
  "rec_cpu": "Intel Core i3-4170",
  "min_gpu": "GTX 760",
  "rec_gpu": "GTX 1050",
  "notes": "More CPU intensive than GPU, modest requirements"
}'::jsonb),

-- Very CPU-heavy zombie survival sim
-- Sources: PCGameBenchmark, System Requirements Lab, Steam discussions (2024-2026)
('Project Zomboid', '108600', 1.4, 0.7, 16, '{
  "min_cpu": "Intel Core 2.77GHz quad-core",
  "rec_cpu": "Intel Core i5-9600K",
  "min_gpu": "Radeon HD 5450",
  "rec_gpu": "Radeon RX 5700 XT",
  "notes": "CPU load incredibly high, hundreds/thousands of zombies stress CPU"
}'::jsonb),

-- MODERN AAA / GPU-HEAVY GAMES

-- GPU-bound open world action-adventure
-- Sources: DSO Gaming, GameGPU, OC3D, NoisyPixel (2024-2026)
('Monster Hunter Wilds', '2246340', 1.0, 1.3, 32, '{
  "min_cpu": "Intel Core i5-10600",
  "rec_cpu": "Intel Core i7-12700K",
  "min_gpu": "GTX 1660 Ti",
  "rec_gpu": "RTX 3080",
  "notes": "Mostly GPU-bound, needs modern 6+ thread CPU, optimizations planned Jan-Feb 2026"
}'::jsonb),

-- GPU-heavy open world martial arts
-- Sources: GameGPU, DSO Gaming, GAM3S.GG (2025-2026)
('Where Winds Meet', '3564740', 1.1, 1.3, 32, '{
  "min_cpu": "AMD Ryzen 4 3600X",
  "rec_cpu": "Intel Core i7-10700",
  "min_gpu": "AMD RX 480",
  "rec_gpu": "RTX 2070 SUPER",
  "notes": "Favours NVIDIA hardware, supports DLSS 4/FSR 3.0/XeSS, traversal stutters"
}'::jsonb),

-- GPU-favored, 60fps capped
-- Sources: GameGPU, PC Gamer, PC Optimized Settings (2025-2026)
('ELDEN RING NIGHTREIGN', '2622380', 0.9, 1.2, 16, '{
  "min_cpu": "Intel Core i5-10600",
  "rec_cpu": "Intel Core i7-10700K",
  "min_gpu": "GTX 1060",
  "rec_gpu": "RTX 3060",
  "notes": "60fps cap, doesn''t properly utilize high-end CPUs, FromSoftware engine"
}'::jsonb),

-- Heavy on both CPU and GPU, UE5
-- Sources: GameGPU, Logical Increments, PCGameBenchmark (2024-2026)
('ARK: Survival Ascended', '2399830', 1.2, 1.3, 32, '{
  "min_cpu": "Intel Core i7-6800K",
  "rec_cpu": "Intel Core i5-10600K",
  "min_gpu": "GTX 1080",
  "rec_gpu": "RTX 3080",
  "notes": "Unreal Engine 5 with Lumen/Nanite, heavy on both CPU and GPU"
}'::jsonb),

-- GPU-bound survival crafting
-- Sources: NotebookCheck, PC Optimized Settings, Digital Trends (2025-2026)
('Enshrouded', '1203620', 1.1, 1.2, 16, '{
  "min_cpu": "Intel Core i5-6400",
  "rec_cpu": "Intel Core i7-8700",
  "min_gpu": "GTX 1060",
  "rec_gpu": "RTX 2070 SUPER",
  "notes": "GPU-bound at 1440p/4K, intermittent CPU stuttering, supports DLSS 4/FSR 3.1"
}'::jsonb),

-- CPU-bottlenecked at high FPS
-- Sources: GameGPU, NotebookCheck, PC Optimized Settings (2024-2026)
('Once Human', '2139460', 1.2, 1.1, 16, '{
  "min_cpu": "Intel Core i5-4460",
  "rec_cpu": "Intel Core i7-7700",
  "min_gpu": "GTX 750 Ti",
  "rec_gpu": "GTX 1060",
  "notes": "CPU bottlenecked at 1080p, unlimited FPS = 100% CPU usage, supports DLSS 3/FSR 2"
}'::jsonb),

-- LIGHTWEIGHT / OLDER GAMES

-- Source engine classic, CPU-bound
-- Sources: GameHelper, TechSpot, Tom''s Hardware (2024-2026)
('Left 4 Dead 2', '550', 1.3, 0.7, 8, '{
  "min_cpu": "Intel Pentium 4 3.0GHz",
  "rec_cpu": "Intel Core i5-4590",
  "min_gpu": "ATI X800",
  "rec_gpu": "GTX 660",
  "notes": "Source engine, single-core bound, multicore rendering improves FPS by 47%"
}'::jsonb),

-- Very CPU-bound 2D platformer
-- Sources: PCGameBenchmark, Geometry Dash Forum (2024-2026)
('Geometry Dash', '322170', 1.2, 0.6, 8, '{
  "min_cpu": "Intel Pentium 4 1500MHz",
  "rec_cpu": "Intel Celeron G1101",
  "min_gpu": "GeForce 6200 LE",
  "rec_gpu": "GTX 280",
  "notes": "CPU intensive game, GT730 could give 144fps if CPU is good enough"
}'::jsonb),

-- Balanced indie co-op horror
-- Sources: PCGameBenchmark, VGTimes, System Requirements Lab (2024)
('Content Warning', '2881650', 1.0, 1.0, 16, '{
  "min_cpu": "Intel Core i5-3210M",
  "rec_cpu": "Intel Core i5-2400",
  "min_gpu": "GTX 1050 Ti",
  "rec_gpu": "GTX 1060",
  "notes": "Mid-range 2016 hardware sufficient, fairly accessible"
}'::jsonb);
