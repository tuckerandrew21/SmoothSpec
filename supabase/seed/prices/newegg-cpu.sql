-- Newegg CPU Prices (PCPartPicker estimates)
-- Intel CPUs
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

-- AMD CPUs
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
