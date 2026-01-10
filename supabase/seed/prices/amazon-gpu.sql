-- Amazon GPU Prices (PCPartPicker estimates)
-- NVIDIA GPUs
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

-- AMD GPUs
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
