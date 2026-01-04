-- RAM, Storage, and PSU Seed Data for Smoothspec
-- These components use specs more than benchmark scores

-- RAM (DDR4 and DDR5 kits)
INSERT INTO components (type, brand, model, release_year, benchmark_score, specs) VALUES

('ram', 'Corsair', 'Vengeance DDR4 16GB (2x8GB) 3200MHz', 2020, 2500, '{
  "capacity": 16,
  "type": "DDR4",
  "speed": 3200,
  "latency": "CL16",
  "kit_config": "2x8GB"
}'::jsonb),

('ram', 'Corsair', 'Vengeance DDR4 32GB (2x16GB) 3200MHz', 2020, 2600, '{
  "capacity": 32,
  "type": "DDR4",
  "speed": 3200,
  "latency": "CL16",
  "kit_config": "2x16GB"
}'::jsonb),

('ram', 'G.Skill', 'Trident Z5 DDR5 32GB (2x16GB) 6000MHz', 2022, 4500, '{
  "capacity": 32,
  "type": "DDR5",
  "speed": 6000,
  "latency": "CL30",
  "kit_config": "2x16GB"
}'::jsonb),

('ram', 'G.Skill', 'Trident Z5 DDR5 32GB (2x16GB) 6400MHz', 2023, 4800, '{
  "capacity": 32,
  "type": "DDR5",
  "speed": 6400,
  "latency": "CL32",
  "kit_config": "2x16GB"
}'::jsonb),

('ram', 'Corsair', 'Dominator Platinum DDR5 32GB (2x16GB) 6000MHz', 2022, 4600, '{
  "capacity": 32,
  "type": "DDR5",
  "speed": 6000,
  "latency": "CL30",
  "kit_config": "2x16GB"
}'::jsonb),

('ram', 'Kingston', 'Fury Beast DDR5 32GB (2x16GB) 5600MHz', 2022, 4200, '{
  "capacity": 32,
  "type": "DDR5",
  "speed": 5600,
  "latency": "CL36",
  "kit_config": "2x16GB"
}'::jsonb),

('ram', 'G.Skill', 'Trident Z5 DDR5 64GB (2x32GB) 6000MHz', 2023, 4700, '{
  "capacity": 64,
  "type": "DDR5",
  "speed": 6000,
  "latency": "CL30",
  "kit_config": "2x32GB"
}'::jsonb),

-- Storage (NVMe SSDs)
('storage', 'Samsung', '980 Pro 1TB', 2020, 7000, '{
  "capacity": 1000,
  "type": "NVMe",
  "interface": "PCIe 4.0",
  "read_speed": 7000,
  "write_speed": 5000,
  "form_factor": "M.2"
}'::jsonb),

('storage', 'Samsung', '990 Pro 1TB', 2022, 7450, '{
  "capacity": 1000,
  "type": "NVMe",
  "interface": "PCIe 4.0",
  "read_speed": 7450,
  "write_speed": 6900,
  "form_factor": "M.2"
}'::jsonb),

('storage', 'Samsung', '990 Pro 2TB', 2022, 7450, '{
  "capacity": 2000,
  "type": "NVMe",
  "interface": "PCIe 4.0",
  "read_speed": 7450,
  "write_speed": 6900,
  "form_factor": "M.2"
}'::jsonb),

('storage', 'WD', 'Black SN850X 1TB', 2022, 7300, '{
  "capacity": 1000,
  "type": "NVMe",
  "interface": "PCIe 4.0",
  "read_speed": 7300,
  "write_speed": 6300,
  "form_factor": "M.2"
}'::jsonb),

('storage', 'WD', 'Black SN850X 2TB', 2022, 7300, '{
  "capacity": 2000,
  "type": "NVMe",
  "interface": "PCIe 4.0",
  "read_speed": 7300,
  "write_speed": 6600,
  "form_factor": "M.2"
}'::jsonb),

('storage', 'Crucial', 'T500 1TB', 2023, 7400, '{
  "capacity": 1000,
  "type": "NVMe",
  "interface": "PCIe 4.0",
  "read_speed": 7400,
  "write_speed": 7000,
  "form_factor": "M.2"
}'::jsonb),

('storage', 'Seagate', 'FireCuda 530 1TB', 2021, 7300, '{
  "capacity": 1000,
  "type": "NVMe",
  "interface": "PCIe 4.0",
  "read_speed": 7300,
  "write_speed": 6000,
  "form_factor": "M.2"
}'::jsonb),

-- PSU (Power Supply Units)
('psu', 'Corsair', 'RM750e', 2022, 750, '{
  "wattage": 750,
  "efficiency": "80+ Gold",
  "modular": true,
  "form_factor": "ATX"
}'::jsonb),

('psu', 'Corsair', 'RM850x', 2021, 850, '{
  "wattage": 850,
  "efficiency": "80+ Gold",
  "modular": true,
  "form_factor": "ATX"
}'::jsonb),

('psu', 'Corsair', 'RM1000x', 2021, 1000, '{
  "wattage": 1000,
  "efficiency": "80+ Gold",
  "modular": true,
  "form_factor": "ATX"
}'::jsonb),

('psu', 'EVGA', 'SuperNOVA 850 G7', 2021, 850, '{
  "wattage": 850,
  "efficiency": "80+ Gold",
  "modular": true,
  "form_factor": "ATX"
}'::jsonb),

('psu', 'Seasonic', 'Focus GX-850', 2020, 850, '{
  "wattage": 850,
  "efficiency": "80+ Gold",
  "modular": true,
  "form_factor": "ATX"
}'::jsonb),

('psu', 'be quiet!', 'Straight Power 12 850W', 2022, 850, '{
  "wattage": 850,
  "efficiency": "80+ Platinum",
  "modular": true,
  "form_factor": "ATX"
}'::jsonb),

('psu', 'Corsair', 'HX1200', 2017, 1200, '{
  "wattage": 1200,
  "efficiency": "80+ Platinum",
  "modular": true,
  "form_factor": "ATX"
}'::jsonb);
