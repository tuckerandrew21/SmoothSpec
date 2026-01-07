-- CPU Seed Data for Smoothspec
-- Benchmark scores based on PassMark multi-thread performance
-- Current gen: Intel 14th Gen, AMD Ryzen 7000 series

INSERT INTO components (type, brand, model, release_year, benchmark_score, specs) VALUES

-- Intel 14th Gen (Raptor Lake Refresh)
('cpu', 'Intel', 'Core i5-14400F', 2024, 24500, '{
  "cores": 10,
  "threads": 16,
  "base_clock": 2.5,
  "boost_clock": 4.7,
  "tdp": 65,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i5-14500', 2024, 28000, '{
  "cores": 14,
  "threads": 20,
  "base_clock": 2.6,
  "boost_clock": 5.0,
  "tdp": 65,
  "socket": "LGA1700",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-14600K', 2024, 32000, '{
  "cores": 14,
  "threads": 20,
  "base_clock": 3.5,
  "boost_clock": 5.3,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-14600KF', 2024, 32000, '{
  "cores": 14,
  "threads": 20,
  "base_clock": 3.5,
  "boost_clock": 5.3,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i7-14700K', 2024, 46000, '{
  "cores": 20,
  "threads": 28,
  "base_clock": 3.4,
  "boost_clock": 5.6,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i7-14700KF', 2024, 46000, '{
  "cores": 20,
  "threads": 28,
  "base_clock": 3.4,
  "boost_clock": 5.6,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i9-14900K', 2024, 59000, '{
  "cores": 24,
  "threads": 32,
  "base_clock": 3.2,
  "boost_clock": 6.0,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i9-14900KF', 2024, 59000, '{
  "cores": 24,
  "threads": 32,
  "base_clock": 3.2,
  "boost_clock": 6.0,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

-- AMD Ryzen 7000 Series (Zen 4)
('cpu', 'AMD', 'Ryzen 5 7600', 2023, 24000, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.8,
  "boost_clock": 5.1,
  "tdp": 65,
  "socket": "AM5",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'AMD', 'Ryzen 5 7600X', 2022, 25000, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 4.7,
  "boost_clock": 5.3,
  "tdp": 105,
  "socket": "AM5",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'AMD', 'Ryzen 7 7700', 2023, 31000, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.8,
  "boost_clock": 5.3,
  "tdp": 65,
  "socket": "AM5",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'AMD', 'Ryzen 7 7700X', 2022, 33000, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 4.5,
  "boost_clock": 5.4,
  "tdp": 105,
  "socket": "AM5",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'AMD', 'Ryzen 7 7800X3D', 2023, 28000, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 4.2,
  "boost_clock": 5.0,
  "tdp": 120,
  "socket": "AM5",
  "integrated_graphics": true,
  "gaming_optimized": true,
  "cache_3d": 96
}'::jsonb),

('cpu', 'AMD', 'Ryzen 9 7900', 2023, 43000, '{
  "cores": 12,
  "threads": 24,
  "base_clock": 3.7,
  "boost_clock": 5.4,
  "tdp": 65,
  "socket": "AM5",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'AMD', 'Ryzen 9 7900X', 2022, 45000, '{
  "cores": 12,
  "threads": 24,
  "base_clock": 4.7,
  "boost_clock": 5.6,
  "tdp": 170,
  "socket": "AM5",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'AMD', 'Ryzen 9 7900X3D', 2023, 42000, '{
  "cores": 12,
  "threads": 24,
  "base_clock": 4.4,
  "boost_clock": 5.6,
  "tdp": 120,
  "socket": "AM5",
  "integrated_graphics": true,
  "gaming_optimized": true,
  "cache_3d": 128
}'::jsonb),

('cpu', 'AMD', 'Ryzen 9 7950X', 2022, 55000, '{
  "cores": 16,
  "threads": 32,
  "base_clock": 4.5,
  "boost_clock": 5.7,
  "tdp": 170,
  "socket": "AM5",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'AMD', 'Ryzen 9 7950X3D', 2023, 52000, '{
  "cores": 16,
  "threads": 32,
  "base_clock": 4.2,
  "boost_clock": 5.7,
  "tdp": 120,
  "socket": "AM5",
  "integrated_graphics": true,
  "gaming_optimized": true,
  "cache_3d": 128
}'::jsonb),

-- Intel 13th Gen (Raptor Lake)
('cpu', 'Intel', 'Core i3-13100F', 2023, 12000, '{
  "cores": 4,
  "threads": 8,
  "base_clock": 3.4,
  "boost_clock": 4.5,
  "tdp": 58,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i5-13400F', 2023, 22000, '{
  "cores": 10,
  "threads": 16,
  "base_clock": 2.5,
  "boost_clock": 4.6,
  "tdp": 65,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i5-13600K', 2022, 31000, '{
  "cores": 14,
  "threads": 20,
  "base_clock": 3.5,
  "boost_clock": 5.1,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-13600KF', 2022, 31000, '{
  "cores": 14,
  "threads": 20,
  "base_clock": 3.5,
  "boost_clock": 5.1,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i7-13700K', 2022, 38000, '{
  "cores": 16,
  "threads": 24,
  "base_clock": 3.4,
  "boost_clock": 5.4,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i7-13700KF', 2022, 38000, '{
  "cores": 16,
  "threads": 24,
  "base_clock": 3.4,
  "boost_clock": 5.4,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i9-13900K', 2022, 53000, '{
  "cores": 24,
  "threads": 32,
  "base_clock": 3.0,
  "boost_clock": 5.8,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i9-13900KF', 2022, 53000, '{
  "cores": 24,
  "threads": 32,
  "base_clock": 3.0,
  "boost_clock": 5.8,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

-- Intel 12th Gen (Alder Lake)
('cpu', 'Intel', 'Core i3-12100F', 2022, 10500, '{
  "cores": 4,
  "threads": 8,
  "base_clock": 3.3,
  "boost_clock": 4.3,
  "tdp": 58,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i5-12400F', 2022, 16200, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 2.5,
  "boost_clock": 4.4,
  "tdp": 65,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i5-12600K', 2021, 23000, '{
  "cores": 10,
  "threads": 16,
  "base_clock": 3.7,
  "boost_clock": 4.9,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-12600KF', 2021, 23000, '{
  "cores": 10,
  "threads": 16,
  "base_clock": 3.7,
  "boost_clock": 4.9,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i7-12700K', 2021, 28000, '{
  "cores": 12,
  "threads": 20,
  "base_clock": 3.6,
  "boost_clock": 5.0,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i7-12700KF', 2021, 28000, '{
  "cores": 12,
  "threads": 20,
  "base_clock": 3.6,
  "boost_clock": 5.0,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i9-12900K', 2021, 35000, '{
  "cores": 16,
  "threads": 24,
  "base_clock": 3.2,
  "boost_clock": 5.2,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i9-12900KF', 2021, 35000, '{
  "cores": 16,
  "threads": 24,
  "base_clock": 3.2,
  "boost_clock": 5.2,
  "tdp": 125,
  "socket": "LGA1700",
  "integrated_graphics": false
}'::jsonb),

-- AMD Ryzen 5000 Series (Zen 3)
('cpu', 'AMD', 'Ryzen 5 5600', 2022, 21000, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.5,
  "boost_clock": 4.4,
  "tdp": 65,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 5 5600X', 2020, 22000, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.7,
  "boost_clock": 4.6,
  "tdp": 65,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 7 5700X', 2022, 24000, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.4,
  "boost_clock": 4.6,
  "tdp": 65,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 7 5800X', 2020, 25000, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.8,
  "boost_clock": 4.7,
  "tdp": 105,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 7 5800X3D', 2022, 24500, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.4,
  "boost_clock": 4.5,
  "tdp": 105,
  "socket": "AM4",
  "integrated_graphics": false,
  "gaming_optimized": true,
  "cache_3d": 96
}'::jsonb),

('cpu', 'AMD', 'Ryzen 9 5900X', 2020, 33000, '{
  "cores": 12,
  "threads": 24,
  "base_clock": 3.7,
  "boost_clock": 4.8,
  "tdp": 105,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 9 5950X', 2020, 39000, '{
  "cores": 16,
  "threads": 32,
  "base_clock": 3.4,
  "boost_clock": 4.9,
  "tdp": 105,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

-- Budget / Older Options
('cpu', 'Intel', 'Core i3-10100F', 2020, 7500, '{
  "cores": 4,
  "threads": 8,
  "base_clock": 3.6,
  "boost_clock": 4.3,
  "tdp": 65,
  "socket": "LGA1200",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 3 3200G', 2019, 6500, '{
  "cores": 4,
  "threads": 4,
  "base_clock": 3.6,
  "boost_clock": 4.0,
  "tdp": 65,
  "socket": "AM4",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'AMD', 'Ryzen 5 3600', 2019, 17500, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.6,
  "boost_clock": 4.2,
  "tdp": 65,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb);
