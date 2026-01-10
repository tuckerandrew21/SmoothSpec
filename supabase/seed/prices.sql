-- Initial Price Seed Data for Smoothspec
-- Prices are Best Buy prices as of Jan 2025 (primary price validation source)
-- Run AFTER component seed files
-- NOTE: Run this periodically to refresh prices or set up automated refresh

-- Note: This query uses subqueries to look up component IDs by brand+model
-- Run AFTER component seed files

-- Clear old prices before inserting fresh data
DELETE FROM prices WHERE retailer = 'Best Buy';
DELETE FROM prices WHERE retailer = 'Amazon';
DELETE FROM prices WHERE retailer = 'Newegg';

-- CPU Prices (Intel) - Best Buy prices as of Jan 2025
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 189.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=Intel+Core+i5-14400F', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14400F';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 232.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=Intel+Core+i5-14500', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14500';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 294.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=Intel+Core+i5-14600K', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14600K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 269.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=Intel+Core+i5-14600KF', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14600KF';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 382.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=Intel+Core+i7-14700K', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i7-14700K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 359.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=Intel+Core+i7-14700KF', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i7-14700KF';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 524.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=Intel+Core+i9-14900K', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i9-14900K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 499.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=Intel+Core+i9-14900KF', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i9-14900KF';

-- AMD CPU Prices - Best Buy prices as of Jan 2025
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 199.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=AMD+Ryzen+5+7600', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 5 7600';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 199.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=AMD+Ryzen+5+7600X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 5 7600X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 279.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=AMD+Ryzen+7+7700', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7700';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 299.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=AMD+Ryzen+7+7700X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7700X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 449.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=AMD+Ryzen+7+7800X3D', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7800X3D';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 349.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=AMD+Ryzen+9+7900', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 399.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=AMD+Ryzen+9+7900X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 499.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=AMD+Ryzen+9+7900X3D', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900X3D';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 499.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=AMD+Ryzen+9+7950X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7950X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 599.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=AMD+Ryzen+9+7950X3D', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7950X3D';

-- GPU Prices (NVIDIA) - Best Buy prices as of Jan 2025
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 299.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RTX+4060', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 399.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RTX+4060+Ti+8GB', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060 Ti 8GB';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 449.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RTX+4060+Ti+16GB', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060 Ti 16GB';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 549.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RTX+4070', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 579.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RTX+4070+Super', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 749.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RTX+4070+Ti', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Ti';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 779.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RTX+4070+Ti+Super', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Ti Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 1099.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RTX+4080', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4080';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 979.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RTX+4080+Super', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4080 Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 1799.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RTX+4090', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4090';

-- GPU Prices (AMD) - Best Buy prices as of Jan 2025
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 259.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RX+7600', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7600';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 299.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RX+7600+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7600 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 419.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RX+7700+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7700 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 479.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RX+7800+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7800 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 549.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RX+7900+GRE', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 GRE';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 699.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RX+7900+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Best Buy', 899.99, 'https://www.bestbuy.com/site/searchpage.jsp?st=RX+7900+XTX', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 XTX';

-- =============================================================================
-- AMAZON PRICES (MSRP estimates from PCPartPicker dataset)
-- Until we have Amazon Product Advertising API, use PCPartPicker as estimate
-- =============================================================================

-- Intel CPUs (Amazon)
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14400F%' LIMIT 1), 189.99),
  'https://www.amazon.com/s?k=Intel+Core+i5-14400F', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14400F';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14500%' AND chipset NOT ILIKE '%14500%F%' LIMIT 1), 232.99),
  'https://www.amazon.com/s?k=Intel+Core+i5-14500', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14500';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14600K%' AND chipset NOT ILIKE '%14600KF%' LIMIT 1), 294.99),
  'https://www.amazon.com/s?k=Intel+Core+i5-14600K', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14600K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14600KF%' LIMIT 1), 269.99),
  'https://www.amazon.com/s?k=Intel+Core+i5-14600KF', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14600KF';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14700K%' AND chipset NOT ILIKE '%14700KF%' LIMIT 1), 382.99),
  'https://www.amazon.com/s?k=Intel+Core+i7-14700K', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i7-14700K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14700KF%' LIMIT 1), 359.99),
  'https://www.amazon.com/s?k=Intel+Core+i7-14700KF', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i7-14700KF';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14900K%' AND chipset NOT ILIKE '%14900KF%' LIMIT 1), 524.99),
  'https://www.amazon.com/s?k=Intel+Core+i9-14900K', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i9-14900K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14900KF%' LIMIT 1), 499.99),
  'https://www.amazon.com/s?k=Intel+Core+i9-14900KF', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i9-14900KF';

-- AMD CPUs (Amazon)
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7600%' AND chipset NOT ILIKE '%7600X%' LIMIT 1), 199.99),
  'https://www.amazon.com/s?k=AMD+Ryzen+5+7600', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 5 7600';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7600X%' LIMIT 1), 199.99),
  'https://www.amazon.com/s?k=AMD+Ryzen+5+7600X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 5 7600X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7700%' AND chipset NOT ILIKE '%7700X%' LIMIT 1), 279.99),
  'https://www.amazon.com/s?k=AMD+Ryzen+7+7700', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7700';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7700X%' AND chipset NOT ILIKE '%7700X3D%' LIMIT 1), 299.99),
  'https://www.amazon.com/s?k=AMD+Ryzen+7+7700X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7700X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7800X3D%' LIMIT 1), 449.99),
  'https://www.amazon.com/s?k=AMD+Ryzen+7+7800X3D', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7800X3D';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7900%' AND chipset NOT ILIKE '%7900X%' LIMIT 1), 349.99),
  'https://www.amazon.com/s?k=AMD+Ryzen+9+7900', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7900X%' AND chipset NOT ILIKE '%7900X3D%' LIMIT 1), 399.99),
  'https://www.amazon.com/s?k=AMD+Ryzen+9+7900X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7900X3D%' LIMIT 1), 499.99),
  'https://www.amazon.com/s?k=AMD+Ryzen+9+7900X3D', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900X3D';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7950X%' AND chipset NOT ILIKE '%7950X3D%' LIMIT 1), 499.99),
  'https://www.amazon.com/s?k=AMD+Ryzen+9+7950X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7950X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7950X3D%' LIMIT 1), 599.99),
  'https://www.amazon.com/s?k=AMD+Ryzen+9+7950X3D', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7950X3D';

-- NVIDIA GPUs (Amazon)
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4060%' AND chipset NOT ILIKE '%4060 Ti%' LIMIT 1), 299.99),
  'https://www.amazon.com/s?k=RTX+4060', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4060 Ti%' AND name ILIKE '%8GB%' LIMIT 1), 399.99),
  'https://www.amazon.com/s?k=RTX+4060+Ti+8GB', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060 Ti 8GB';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4060 Ti%' AND name ILIKE '%16GB%' LIMIT 1), 449.99),
  'https://www.amazon.com/s?k=RTX+4060+Ti+16GB', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060 Ti 16GB';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4070%' AND chipset NOT ILIKE '%4070 Ti%' AND chipset NOT ILIKE '%4070 Super%' LIMIT 1), 549.99),
  'https://www.amazon.com/s?k=RTX+4070', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4070 Super%' LIMIT 1), 579.99),
  'https://www.amazon.com/s?k=RTX+4070+Super', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4070 Ti%' AND chipset NOT ILIKE '%4070 Ti Super%' LIMIT 1), 749.99),
  'https://www.amazon.com/s?k=RTX+4070+Ti', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Ti';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4070 Ti Super%' LIMIT 1), 779.99),
  'https://www.amazon.com/s?k=RTX+4070+Ti+Super', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Ti Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4080%' AND chipset NOT ILIKE '%4080 Super%' LIMIT 1), 1099.99),
  'https://www.amazon.com/s?k=RTX+4080', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4080';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4080 Super%' LIMIT 1), 979.99),
  'https://www.amazon.com/s?k=RTX+4080+Super', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4080 Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4090%' LIMIT 1), 1799.99),
  'https://www.amazon.com/s?k=RTX+4090', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4090';

-- AMD GPUs (Amazon)
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7600%' AND chipset NOT ILIKE '%7600 XT%' LIMIT 1), 259.99),
  'https://www.amazon.com/s?k=RX+7600', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7600';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7600 XT%' LIMIT 1), 299.99),
  'https://www.amazon.com/s?k=RX+7600+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7600 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7700 XT%' LIMIT 1), 419.99),
  'https://www.amazon.com/s?k=RX+7700+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7700 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7800 XT%' LIMIT 1), 479.99),
  'https://www.amazon.com/s?k=RX+7800+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7800 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7900 GRE%' LIMIT 1), 549.99),
  'https://www.amazon.com/s?k=RX+7900+GRE', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 GRE';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7900 XT%' AND chipset NOT ILIKE '%7900 XTX%' LIMIT 1), 699.99),
  'https://www.amazon.com/s?k=RX+7900+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Amazon',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7900 XTX%' LIMIT 1), 899.99),
  'https://www.amazon.com/s?k=RX+7900+XTX', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 XTX';

-- =============================================================================
-- NEWEGG PRICES (MSRP estimates from PCPartPicker dataset)
-- Until we have Newegg/CJ Affiliate API, use PCPartPicker as estimate
-- =============================================================================

-- Intel CPUs (Newegg)
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14400F%' LIMIT 1), 189.99),
  'https://www.newegg.com/p/pl?d=Intel+Core+i5-14400F', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14400F';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14500%' AND chipset NOT ILIKE '%14500%F%' LIMIT 1), 232.99),
  'https://www.newegg.com/p/pl?d=Intel+Core+i5-14500', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14500';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14600K%' AND chipset NOT ILIKE '%14600KF%' LIMIT 1), 294.99),
  'https://www.newegg.com/p/pl?d=Intel+Core+i5-14600K', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14600K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14600KF%' LIMIT 1), 269.99),
  'https://www.newegg.com/p/pl?d=Intel+Core+i5-14600KF', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14600KF';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14700K%' AND chipset NOT ILIKE '%14700KF%' LIMIT 1), 382.99),
  'https://www.newegg.com/p/pl?d=Intel+Core+i7-14700K', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i7-14700K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14700KF%' LIMIT 1), 359.99),
  'https://www.newegg.com/p/pl?d=Intel+Core+i7-14700KF', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i7-14700KF';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14900K%' AND chipset NOT ILIKE '%14900KF%' LIMIT 1), 524.99),
  'https://www.newegg.com/p/pl?d=Intel+Core+i9-14900K', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i9-14900K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%14900KF%' LIMIT 1), 499.99),
  'https://www.newegg.com/p/pl?d=Intel+Core+i9-14900KF', true, NOW()
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i9-14900KF';

-- AMD CPUs (Newegg)
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7600%' AND chipset NOT ILIKE '%7600X%' LIMIT 1), 199.99),
  'https://www.newegg.com/p/pl?d=AMD+Ryzen+5+7600', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 5 7600';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7600X%' LIMIT 1), 199.99),
  'https://www.newegg.com/p/pl?d=AMD+Ryzen+5+7600X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 5 7600X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7700%' AND chipset NOT ILIKE '%7700X%' LIMIT 1), 279.99),
  'https://www.newegg.com/p/pl?d=AMD+Ryzen+7+7700', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7700';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7700X%' AND chipset NOT ILIKE '%7700X3D%' LIMIT 1), 299.99),
  'https://www.newegg.com/p/pl?d=AMD+Ryzen+7+7700X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7700X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7800X3D%' LIMIT 1), 449.99),
  'https://www.newegg.com/p/pl?d=AMD+Ryzen+7+7800X3D', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7800X3D';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7900%' AND chipset NOT ILIKE '%7900X%' LIMIT 1), 349.99),
  'https://www.newegg.com/p/pl?d=AMD+Ryzen+9+7900', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7900X%' AND chipset NOT ILIKE '%7900X3D%' LIMIT 1), 399.99),
  'https://www.newegg.com/p/pl?d=AMD+Ryzen+9+7900X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7900X3D%' LIMIT 1), 499.99),
  'https://www.newegg.com/p/pl?d=AMD+Ryzen+9+7900X3D', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900X3D';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7950X%' AND chipset NOT ILIKE '%7950X3D%' LIMIT 1), 499.99),
  'https://www.newegg.com/p/pl?d=AMD+Ryzen+9+7950X', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7950X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'cpu' AND chipset ILIKE '%7950X3D%' LIMIT 1), 599.99),
  'https://www.newegg.com/p/pl?d=AMD+Ryzen+9+7950X3D', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7950X3D';

-- NVIDIA GPUs (Newegg)
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4060%' AND chipset NOT ILIKE '%4060 Ti%' LIMIT 1), 299.99),
  'https://www.newegg.com/p/pl?d=RTX+4060', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4060 Ti%' AND name ILIKE '%8GB%' LIMIT 1), 399.99),
  'https://www.newegg.com/p/pl?d=RTX+4060+Ti+8GB', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060 Ti 8GB';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4060 Ti%' AND name ILIKE '%16GB%' LIMIT 1), 449.99),
  'https://www.newegg.com/p/pl?d=RTX+4060+Ti+16GB', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060 Ti 16GB';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4070%' AND chipset NOT ILIKE '%4070 Ti%' AND chipset NOT ILIKE '%4070 Super%' LIMIT 1), 549.99),
  'https://www.newegg.com/p/pl?d=RTX+4070', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4070 Super%' LIMIT 1), 579.99),
  'https://www.newegg.com/p/pl?d=RTX+4070+Super', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4070 Ti%' AND chipset NOT ILIKE '%4070 Ti Super%' LIMIT 1), 749.99),
  'https://www.newegg.com/p/pl?d=RTX+4070+Ti', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Ti';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4070 Ti Super%' LIMIT 1), 779.99),
  'https://www.newegg.com/p/pl?d=RTX+4070+Ti+Super', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Ti Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4080%' AND chipset NOT ILIKE '%4080 Super%' LIMIT 1), 1099.99),
  'https://www.newegg.com/p/pl?d=RTX+4080', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4080';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4080 Super%' LIMIT 1), 979.99),
  'https://www.newegg.com/p/pl?d=RTX+4080+Super', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4080 Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%4090%' LIMIT 1), 1799.99),
  'https://www.newegg.com/p/pl?d=RTX+4090', true, NOW()
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4090';

-- AMD GPUs (Newegg)
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7600%' AND chipset NOT ILIKE '%7600 XT%' LIMIT 1), 259.99),
  'https://www.newegg.com/p/pl?d=RX+7600', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7600';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7600 XT%' LIMIT 1), 299.99),
  'https://www.newegg.com/p/pl?d=RX+7600+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7600 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7700 XT%' LIMIT 1), 419.99),
  'https://www.newegg.com/p/pl?d=RX+7700+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7700 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7800 XT%' LIMIT 1), 479.99),
  'https://www.newegg.com/p/pl?d=RX+7800+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7800 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7900 GRE%' LIMIT 1), 549.99),
  'https://www.newegg.com/p/pl?d=RX+7900+GRE', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 GRE';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7900 XT%' AND chipset NOT ILIKE '%7900 XTX%' LIMIT 1), 699.99),
  'https://www.newegg.com/p/pl?d=RX+7900+XT', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock, last_updated)
SELECT c.id, 'Newegg',
  COALESCE((SELECT price FROM pcpartpicker_prices WHERE category = 'gpu' AND chipset ILIKE '%7900 XTX%' LIMIT 1), 899.99),
  'https://www.newegg.com/p/pl?d=RX+7900+XTX', true, NOW()
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 XTX';
