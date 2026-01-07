-- GPU Seed Data for Smoothspec
-- Benchmark scores based on PassMark G3D performance
-- Current gen: NVIDIA RTX 40 series, AMD RX 7000 series

INSERT INTO components (type, brand, model, release_year, benchmark_score, specs) VALUES

-- NVIDIA RTX 40 Series (Ada Lovelace)
('gpu', 'NVIDIA', 'GeForce RTX 4060', 2023, 13000, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 115,
  "architecture": "Ada Lovelace",
  "ray_tracing": true,
  "dlss": 3
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 4060 Ti 8GB', 2023, 15500, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 160,
  "architecture": "Ada Lovelace",
  "ray_tracing": true,
  "dlss": 3
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 4060 Ti 16GB', 2023, 15700, '{
  "vram": 16,
  "memory_type": "GDDR6",
  "tdp": 165,
  "architecture": "Ada Lovelace",
  "ray_tracing": true,
  "dlss": 3
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 4070', 2023, 19000, '{
  "vram": 12,
  "memory_type": "GDDR6X",
  "tdp": 200,
  "architecture": "Ada Lovelace",
  "ray_tracing": true,
  "dlss": 3
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 4070 Super', 2024, 22000, '{
  "vram": 12,
  "memory_type": "GDDR6X",
  "tdp": 220,
  "architecture": "Ada Lovelace",
  "ray_tracing": true,
  "dlss": 3
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 4070 Ti', 2023, 23000, '{
  "vram": 12,
  "memory_type": "GDDR6X",
  "tdp": 285,
  "architecture": "Ada Lovelace",
  "ray_tracing": true,
  "dlss": 3
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 4070 Ti Super', 2024, 25000, '{
  "vram": 16,
  "memory_type": "GDDR6X",
  "tdp": 285,
  "architecture": "Ada Lovelace",
  "ray_tracing": true,
  "dlss": 3
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 4080', 2022, 28000, '{
  "vram": 16,
  "memory_type": "GDDR6X",
  "tdp": 320,
  "architecture": "Ada Lovelace",
  "ray_tracing": true,
  "dlss": 3
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 4080 Super', 2024, 29500, '{
  "vram": 16,
  "memory_type": "GDDR6X",
  "tdp": 320,
  "architecture": "Ada Lovelace",
  "ray_tracing": true,
  "dlss": 3
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 4090', 2022, 38000, '{
  "vram": 24,
  "memory_type": "GDDR6X",
  "tdp": 450,
  "architecture": "Ada Lovelace",
  "ray_tracing": true,
  "dlss": 3
}'::jsonb),

-- AMD RX 7000 Series (RDNA 3)
('gpu', 'AMD', 'Radeon RX 7600', 2023, 11500, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 165,
  "architecture": "RDNA 3",
  "ray_tracing": true,
  "fsr": 3
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 7600 XT', 2024, 13500, '{
  "vram": 16,
  "memory_type": "GDDR6",
  "tdp": 190,
  "architecture": "RDNA 3",
  "ray_tracing": true,
  "fsr": 3
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 7700 XT', 2023, 16500, '{
  "vram": 12,
  "memory_type": "GDDR6",
  "tdp": 245,
  "architecture": "RDNA 3",
  "ray_tracing": true,
  "fsr": 3
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 7800 XT', 2023, 19500, '{
  "vram": 16,
  "memory_type": "GDDR6",
  "tdp": 263,
  "architecture": "RDNA 3",
  "ray_tracing": true,
  "fsr": 3
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 7900 GRE', 2024, 22500, '{
  "vram": 16,
  "memory_type": "GDDR6",
  "tdp": 260,
  "architecture": "RDNA 3",
  "ray_tracing": true,
  "fsr": 3
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 7900 XT', 2022, 26000, '{
  "vram": 20,
  "memory_type": "GDDR6",
  "tdp": 315,
  "architecture": "RDNA 3",
  "ray_tracing": true,
  "fsr": 3
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 7900 XTX', 2022, 29000, '{
  "vram": 24,
  "memory_type": "GDDR6",
  "tdp": 355,
  "architecture": "RDNA 3",
  "ray_tracing": true,
  "fsr": 3
}'::jsonb),

-- NVIDIA RTX 30 Series (Ampere) - HIGH PRIORITY per Steam Hardware Survey
('gpu', 'NVIDIA', 'GeForce RTX 3060', 2021, 11500, '{
  "vram": 12,
  "memory_type": "GDDR6",
  "tdp": 170,
  "architecture": "Ampere",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 3060 Ti', 2020, 14000, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 200,
  "architecture": "Ampere",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 3070', 2020, 17000, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 220,
  "architecture": "Ampere",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 3070 Ti', 2021, 18500, '{
  "vram": 8,
  "memory_type": "GDDR6X",
  "tdp": 290,
  "architecture": "Ampere",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 3080', 2020, 21500, '{
  "vram": 10,
  "memory_type": "GDDR6X",
  "tdp": 320,
  "architecture": "Ampere",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 3080 Ti', 2021, 24000, '{
  "vram": 12,
  "memory_type": "GDDR6X",
  "tdp": 350,
  "architecture": "Ampere",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 3090', 2020, 25500, '{
  "vram": 24,
  "memory_type": "GDDR6X",
  "tdp": 350,
  "architecture": "Ampere",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 3090 Ti', 2022, 27500, '{
  "vram": 24,
  "memory_type": "GDDR6X",
  "tdp": 450,
  "architecture": "Ampere",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 3050', 2022, 9000, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 130,
  "architecture": "Ampere",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

-- NVIDIA GTX 16 Series (Turing) - HIGH PRIORITY per Steam Hardware Survey
('gpu', 'NVIDIA', 'GeForce GTX 1650', 2019, 5500, '{
  "vram": 4,
  "memory_type": "GDDR5",
  "tdp": 75,
  "architecture": "Turing",
  "ray_tracing": false
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce GTX 1650 Super', 2019, 7000, '{
  "vram": 4,
  "memory_type": "GDDR6",
  "tdp": 100,
  "architecture": "Turing",
  "ray_tracing": false
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce GTX 1660', 2019, 8500, '{
  "vram": 6,
  "memory_type": "GDDR5",
  "tdp": 120,
  "architecture": "Turing",
  "ray_tracing": false
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce GTX 1660 Super', 2019, 9000, '{
  "vram": 6,
  "memory_type": "GDDR6",
  "tdp": 125,
  "architecture": "Turing",
  "ray_tracing": false
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce GTX 1660 Ti', 2019, 9500, '{
  "vram": 6,
  "memory_type": "GDDR6",
  "tdp": 120,
  "architecture": "Turing",
  "ray_tracing": false
}'::jsonb),

-- NVIDIA RTX 20 Series (Turing)
('gpu', 'NVIDIA', 'GeForce RTX 2060', 2019, 10000, '{
  "vram": 6,
  "memory_type": "GDDR6",
  "tdp": 160,
  "architecture": "Turing",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 2060 Super', 2019, 11000, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 175,
  "architecture": "Turing",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 2070', 2018, 12000, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 175,
  "architecture": "Turing",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 2070 Super', 2019, 13000, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 215,
  "architecture": "Turing",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 2080', 2018, 14500, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 215,
  "architecture": "Turing",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 2080 Super', 2019, 15000, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 250,
  "architecture": "Turing",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce RTX 2080 Ti', 2018, 17500, '{
  "vram": 11,
  "memory_type": "GDDR6",
  "tdp": 250,
  "architecture": "Turing",
  "ray_tracing": true,
  "dlss": 2
}'::jsonb),

-- AMD RX 6000 Series (RDNA 2) - HIGH PRIORITY
('gpu', 'AMD', 'Radeon RX 6600', 2021, 9500, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 132,
  "architecture": "RDNA 2",
  "ray_tracing": true,
  "fsr": 2
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 6600 XT', 2021, 10500, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 160,
  "architecture": "RDNA 2",
  "ray_tracing": true,
  "fsr": 2
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 6650 XT', 2022, 11000, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 180,
  "architecture": "RDNA 2",
  "ray_tracing": true,
  "fsr": 2
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 6700 XT', 2021, 13500, '{
  "vram": 12,
  "memory_type": "GDDR6",
  "tdp": 230,
  "architecture": "RDNA 2",
  "ray_tracing": true,
  "fsr": 2
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 6750 XT', 2022, 14000, '{
  "vram": 12,
  "memory_type": "GDDR6",
  "tdp": 250,
  "architecture": "RDNA 2",
  "ray_tracing": true,
  "fsr": 2
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 6800', 2020, 18000, '{
  "vram": 16,
  "memory_type": "GDDR6",
  "tdp": 250,
  "architecture": "RDNA 2",
  "ray_tracing": true,
  "fsr": 2
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 6800 XT', 2020, 20000, '{
  "vram": 16,
  "memory_type": "GDDR6",
  "tdp": 300,
  "architecture": "RDNA 2",
  "ray_tracing": true,
  "fsr": 2
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 6900 XT', 2020, 22000, '{
  "vram": 16,
  "memory_type": "GDDR6",
  "tdp": 300,
  "architecture": "RDNA 2",
  "ray_tracing": true,
  "fsr": 2
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 6950 XT', 2022, 23500, '{
  "vram": 16,
  "memory_type": "GDDR6",
  "tdp": 335,
  "architecture": "RDNA 2",
  "ray_tracing": true,
  "fsr": 2
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 6500 XT', 2022, 5000, '{
  "vram": 4,
  "memory_type": "GDDR6",
  "tdp": 107,
  "architecture": "RDNA 2",
  "ray_tracing": true,
  "fsr": 2
}'::jsonb),

-- Older NVIDIA GTX 10 Series (Pascal) - Still common
('gpu', 'NVIDIA', 'GeForce GTX 1050 Ti', 2016, 3500, '{
  "vram": 4,
  "memory_type": "GDDR5",
  "tdp": 75,
  "architecture": "Pascal",
  "ray_tracing": false
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce GTX 1060 6GB', 2016, 6500, '{
  "vram": 6,
  "memory_type": "GDDR5",
  "tdp": 120,
  "architecture": "Pascal",
  "ray_tracing": false
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce GTX 1070', 2016, 9000, '{
  "vram": 8,
  "memory_type": "GDDR5",
  "tdp": 150,
  "architecture": "Pascal",
  "ray_tracing": false
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce GTX 1070 Ti', 2017, 10500, '{
  "vram": 8,
  "memory_type": "GDDR5",
  "tdp": 180,
  "architecture": "Pascal",
  "ray_tracing": false
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce GTX 1080', 2016, 11500, '{
  "vram": 8,
  "memory_type": "GDDR5X",
  "tdp": 180,
  "architecture": "Pascal",
  "ray_tracing": false
}'::jsonb),

('gpu', 'NVIDIA', 'GeForce GTX 1080 Ti', 2017, 14000, '{
  "vram": 11,
  "memory_type": "GDDR5X",
  "tdp": 250,
  "architecture": "Pascal",
  "ray_tracing": false
}'::jsonb),

-- Older AMD RX 500/5000 Series - Still common
('gpu', 'AMD', 'Radeon RX 580', 2017, 5500, '{
  "vram": 8,
  "memory_type": "GDDR5",
  "tdp": 185,
  "architecture": "Polaris",
  "ray_tracing": false
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 5600 XT', 2020, 9000, '{
  "vram": 6,
  "memory_type": "GDDR6",
  "tdp": 150,
  "architecture": "RDNA",
  "ray_tracing": false
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 5700', 2019, 10500, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 180,
  "architecture": "RDNA",
  "ray_tracing": false
}'::jsonb),

('gpu', 'AMD', 'Radeon RX 5700 XT', 2019, 12000, '{
  "vram": 8,
  "memory_type": "GDDR6",
  "tdp": 225,
  "architecture": "RDNA",
  "ray_tracing": false
}'::jsonb);
