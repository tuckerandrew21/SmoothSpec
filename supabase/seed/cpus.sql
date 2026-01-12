-- CPU Seed Data for Smoothspec
-- Benchmark scores based on PassMark multi-thread performance
-- Current gen: AMD Ryzen 9000 series, Intel 14th Gen

INSERT INTO components (type, brand, model, release_year, benchmark_score, specs) VALUES

-- =============================================================================
-- LATEST GENERATION (2024-2025)
-- =============================================================================

-- AMD Ryzen 9000 Series (Zen 5) - 2024-2025
-- Source: PassMark CPU benchmarks (January 2026)
-- Architecture: Zen 5 with support for DDR5-5600 and PCIe 5.0
('cpu', 'AMD', 'Ryzen 9 9950X', 2024, 65857, '{
  "cores": 16,
  "threads": 32,
  "base_clock": 4.3,
  "boost_clock": 5.7,
  "tdp": 170,
  "socket": "AM5",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 9 9900X', 2024, 53863, '{
  "cores": 12,
  "threads": 24,
  "base_clock": 4.4,
  "boost_clock": 5.6,
  "tdp": 120,
  "socket": "AM5",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 7 9700X', 2024, 37127, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.8,
  "boost_clock": 5.5,
  "tdp": 65,
  "socket": "AM5",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 5 9600X', 2024, 29996, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.9,
  "boost_clock": 5.4,
  "tdp": 65,
  "socket": "AM5",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 5 9600', 2025, 29369, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.8,
  "boost_clock": 5.2,
  "tdp": 65,
  "socket": "AM5",
  "integrated_graphics": false
}'::jsonb),

-- Intel 11th Gen (Rocket Lake) - 2021
-- Source: PassMark CPU benchmarks (January 2026)
('cpu', 'Intel', 'Core i9-11900K', 2021, 24978, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.5,
  "boost_clock": 5.3,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i9-11900KF', 2021, 24557, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.5,
  "boost_clock": 5.3,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i7-11700K', 2021, 24350, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.6,
  "boost_clock": 5.0,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i7-11700KF', 2021, 23823, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.6,
  "boost_clock": 5.0,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i5-11600K', 2021, 19516, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.9,
  "boost_clock": 4.9,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-11600KF', 2021, 19466, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.9,
  "boost_clock": 4.9,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": false
}'::jsonb),

-- Intel 10th Gen (Comet Lake) - 2020
-- Source: PassMark CPU benchmarks (January 2026)
('cpu', 'Intel', 'Core i9-10900K', 2020, 22365, '{
  "cores": 10,
  "threads": 20,
  "base_clock": 3.7,
  "boost_clock": 5.3,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i9-10900KF', 2020, 22226, '{
  "cores": 10,
  "threads": 20,
  "base_clock": 3.7,
  "boost_clock": 5.3,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i7-10700K', 2020, 18553, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.8,
  "boost_clock": 5.1,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i7-10700KF', 2020, 18363, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.8,
  "boost_clock": 5.1,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i7-10700', 2020, 16052, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 2.9,
  "boost_clock": 4.8,
  "tdp": 65,
  "socket": "LGA1200",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-10600K', 2020, 14240, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 4.1,
  "boost_clock": 4.8,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-10600KF', 2020, 14134, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 4.1,
  "boost_clock": 4.8,
  "tdp": 125,
  "socket": "LGA1200",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i5-10600', 2020, 13570, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.3,
  "boost_clock": 4.8,
  "tdp": 65,
  "socket": "LGA1200",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-10400F', 2020, 12111, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 2.9,
  "boost_clock": 4.3,
  "tdp": 65,
  "socket": "LGA1200",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'Intel', 'Core i5-10400', 2020, 11984, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 2.9,
  "boost_clock": 4.3,
  "tdp": 65,
  "socket": "LGA1200",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i3-10300', 2020, 9290, '{
  "cores": 4,
  "threads": 8,
  "base_clock": 3.7,
  "boost_clock": 4.4,
  "tdp": 65,
  "socket": "LGA1200",
  "integrated_graphics": true
}'::jsonb),

-- =============================================================================
-- EARLIER AMD RYZEN DESKTOP GENERATIONS
-- =============================================================================

-- AMD Ryzen 1000 Series (Zen 1) - 2017
('cpu', 'AMD', 'Ryzen 7 1800X', 2017, 12989, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.6,
  "boost_clock": 4.0,
  "tdp": 95,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 5 1600X', 2017, 9756, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.6,
  "boost_clock": 4.0,
  "tdp": 95,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

-- AMD Ryzen 2000 Series (Zen+) - 2018
('cpu', 'AMD', 'Ryzen 7 2700X', 2018, 14601, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.7,
  "boost_clock": 4.3,
  "tdp": 105,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 5 2600X', 2018, 11236, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.6,
  "boost_clock": 4.2,
  "tdp": 95,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

-- AMD Ryzen 3000 Series (Zen 2) - 2019
('cpu', 'AMD', 'Ryzen 7 3700X', 2019, 17202, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.6,
  "boost_clock": 4.4,
  "tdp": 65,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'Ryzen 5 3600X', 2019, 13576, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.8,
  "boost_clock": 4.4,
  "tdp": 95,
  "socket": "AM4",
  "integrated_graphics": false
}'::jsonb),

-- AMD Ryzen 4000 Series (Zen 2) - 2020
('cpu', 'AMD', 'Ryzen 7 4700G', 2020, 15888, '{
  "cores": 8,
  "threads": 16,
  "base_clock": 3.6,
  "boost_clock": 4.4,
  "tdp": 65,
  "socket": "AM4",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'AMD', 'Ryzen 5 4650G', 2020, 12445, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.7,
  "boost_clock": 4.3,
  "tdp": 65,
  "socket": "AM4",
  "integrated_graphics": true
}'::jsonb),

-- =============================================================================
-- EARLIER INTEL DESKTOP GENERATIONS
-- =============================================================================

-- Intel 4th Gen (Haswell) - 2013-2014
('cpu', 'Intel', 'Core i7-4770K', 2013, 9540, '{
  "cores": 4,
  "threads": 8,
  "base_clock": 3.5,
  "boost_clock": 3.9,
  "tdp": 84,
  "socket": "LGA1150",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-4670K', 2013, 8237, '{
  "cores": 4,
  "threads": 4,
  "base_clock": 3.4,
  "boost_clock": 3.8,
  "tdp": 84,
  "socket": "LGA1150",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i3-4130', 2013, 5221, '{
  "cores": 2,
  "threads": 4,
  "base_clock": 3.4,
  "boost_clock": null,
  "tdp": 54,
  "socket": "LGA1150",
  "integrated_graphics": true
}'::jsonb),

-- Intel 5th Gen (Broadwell) - 2014-2015
('cpu', 'Intel', 'Core i7-5775C', 2015, 9823, '{
  "cores": 4,
  "threads": 8,
  "base_clock": 3.3,
  "boost_clock": 3.7,
  "tdp": 65,
  "socket": "LGA1150",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-5675C', 2015, 8541, '{
  "cores": 4,
  "threads": 4,
  "base_clock": 3.1,
  "boost_clock": 3.6,
  "tdp": 65,
  "socket": "LGA1150",
  "integrated_graphics": true
}'::jsonb),

-- Intel 6th Gen (Skylake) - 2015-2016
('cpu', 'Intel', 'Core i7-6700K', 2015, 10524, '{
  "cores": 4,
  "threads": 8,
  "base_clock": 4.0,
  "boost_clock": 4.2,
  "tdp": 91,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-6600K', 2015, 9052, '{
  "cores": 4,
  "threads": 4,
  "base_clock": 3.5,
  "boost_clock": 3.9,
  "tdp": 91,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i3-6100', 2015, 5843, '{
  "cores": 2,
  "threads": 4,
  "base_clock": 3.7,
  "boost_clock": null,
  "tdp": 51,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

-- Intel 7th Gen (Kaby Lake) - 2016-2017
('cpu', 'Intel', 'Core i7-7700K', 2017, 11232, '{
  "cores": 4,
  "threads": 8,
  "base_clock": 4.2,
  "boost_clock": 4.5,
  "tdp": 91,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-7600K', 2017, 9512, '{
  "cores": 4,
  "threads": 4,
  "base_clock": 3.8,
  "boost_clock": 4.2,
  "tdp": 91,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i3-7350K', 2017, 6012, '{
  "cores": 2,
  "threads": 4,
  "base_clock": 4.2,
  "boost_clock": null,
  "tdp": 60,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

-- Intel 8th Gen (Coffee Lake) - 2017-2018
('cpu', 'Intel', 'Core i7-8700K', 2017, 13458, '{
  "cores": 6,
  "threads": 12,
  "base_clock": 3.7,
  "boost_clock": 4.7,
  "tdp": 95,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-8600K', 2017, 11232, '{
  "cores": 6,
  "threads": 6,
  "base_clock": 3.6,
  "boost_clock": 4.3,
  "tdp": 95,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i3-8350K', 2017, 7521, '{
  "cores": 4,
  "threads": 4,
  "base_clock": 4.0,
  "boost_clock": null,
  "tdp": 91,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

-- Intel 9th Gen (Coffee Lake Refresh) - 2018-2019
('cpu', 'Intel', 'Core i7-9700K', 2018, 14562, '{
  "cores": 8,
  "threads": 8,
  "base_clock": 3.6,
  "boost_clock": 4.9,
  "tdp": 95,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i5-9600K', 2018, 12032, '{
  "cores": 6,
  "threads": 6,
  "base_clock": 3.7,
  "boost_clock": 4.6,
  "tdp": 95,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

('cpu', 'Intel', 'Core i3-9350K', 2018, 8021, '{
  "cores": 4,
  "threads": 4,
  "base_clock": 4.0,
  "boost_clock": 4.6,
  "tdp": 91,
  "socket": "LGA1151",
  "integrated_graphics": true
}'::jsonb),

-- =============================================================================
-- AMD FX DESKTOP SERIES (Legacy AMD CPUs)
-- =============================================================================

-- AMD FX Series (Vishera, Piledriver Architecture) - 2011-2014
('cpu', 'AMD', 'FX-8350', 2012, 6090, '{
  "cores": 8,
  "threads": 8,
  "base_clock": 4.0,
  "boost_clock": 4.2,
  "tdp": 125,
  "socket": "AM3+",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'FX-8320', 2012, 5432, '{
  "cores": 8,
  "threads": 8,
  "base_clock": 3.5,
  "boost_clock": 4.0,
  "tdp": 125,
  "socket": "AM3+",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'FX-6300', 2012, 5124, '{
  "cores": 6,
  "threads": 6,
  "base_clock": 3.5,
  "boost_clock": 4.1,
  "tdp": 95,
  "socket": "AM3+",
  "integrated_graphics": false
}'::jsonb),

('cpu', 'AMD', 'FX-4300', 2012, 4321, '{
  "cores": 4,
  "threads": 4,
  "base_clock": 3.8,
  "boost_clock": 4.0,
  "tdp": 95,
  "socket": "AM3+",
  "integrated_graphics": false
}'::jsonb),

-- =============================================================================
-- RECENT GENERATION (2023-2024)
-- =============================================================================

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
