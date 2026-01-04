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
}'::jsonb);
