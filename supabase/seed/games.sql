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
}'::jsonb);
