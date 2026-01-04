-- Initial Price Seed Data for Smoothspec
-- Prices are approximate MSRP/street prices as of Jan 2024
-- affiliate_url uses Amazon search links until API access is approved

-- Note: This query uses subqueries to look up component IDs by brand+model
-- Run AFTER component seed files

-- CPU Prices
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 199.99, 'https://www.amazon.com/s?k=Intel+Core+i5-14400F', true
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14400F';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 249.99, 'https://www.amazon.com/s?k=Intel+Core+i5-14500', true
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14500';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 319.99, 'https://www.amazon.com/s?k=Intel+Core+i5-14600K', true
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14600K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 294.99, 'https://www.amazon.com/s?k=Intel+Core+i5-14600KF', true
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i5-14600KF';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 409.99, 'https://www.amazon.com/s?k=Intel+Core+i7-14700K', true
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i7-14700K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 384.99, 'https://www.amazon.com/s?k=Intel+Core+i7-14700KF', true
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i7-14700KF';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 549.99, 'https://www.amazon.com/s?k=Intel+Core+i9-14900K', true
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i9-14900K';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 524.99, 'https://www.amazon.com/s?k=Intel+Core+i9-14900KF', true
FROM components c WHERE c.brand = 'Intel' AND c.model = 'Core i9-14900KF';

-- AMD CPU Prices
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 199.99, 'https://www.amazon.com/s?k=AMD+Ryzen+5+7600', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 5 7600';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 229.99, 'https://www.amazon.com/s?k=AMD+Ryzen+5+7600X', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 5 7600X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 299.99, 'https://www.amazon.com/s?k=AMD+Ryzen+7+7700', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7700';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 349.99, 'https://www.amazon.com/s?k=AMD+Ryzen+7+7700X', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7700X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 449.99, 'https://www.amazon.com/s?k=AMD+Ryzen+7+7800X3D', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 7 7800X3D';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 399.99, 'https://www.amazon.com/s?k=AMD+Ryzen+9+7900', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 449.99, 'https://www.amazon.com/s?k=AMD+Ryzen+9+7900X', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 549.99, 'https://www.amazon.com/s?k=AMD+Ryzen+9+7900X3D', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7900X3D';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 549.99, 'https://www.amazon.com/s?k=AMD+Ryzen+9+7950X', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7950X';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 649.99, 'https://www.amazon.com/s?k=AMD+Ryzen+9+7950X3D', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Ryzen 9 7950X3D';

-- GPU Prices (NVIDIA)
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 299.99, 'https://www.amazon.com/s?k=RTX+4060', true
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 399.99, 'https://www.amazon.com/s?k=RTX+4060+Ti+8GB', true
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060 Ti 8GB';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 449.99, 'https://www.amazon.com/s?k=RTX+4060+Ti+16GB', true
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4060 Ti 16GB';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 549.99, 'https://www.amazon.com/s?k=RTX+4070', true
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 599.99, 'https://www.amazon.com/s?k=RTX+4070+Super', true
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 799.99, 'https://www.amazon.com/s?k=RTX+4070+Ti', true
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Ti';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 799.99, 'https://www.amazon.com/s?k=RTX+4070+Ti+Super', true
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4070 Ti Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 1199.99, 'https://www.amazon.com/s?k=RTX+4080', true
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4080';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 999.99, 'https://www.amazon.com/s?k=RTX+4080+Super', true
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4080 Super';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 1599.99, 'https://www.amazon.com/s?k=RTX+4090', true
FROM components c WHERE c.brand = 'NVIDIA' AND c.model = 'GeForce RTX 4090';

-- GPU Prices (AMD)
INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 269.99, 'https://www.amazon.com/s?k=RX+7600', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7600';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 329.99, 'https://www.amazon.com/s?k=RX+7600+XT', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7600 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 449.99, 'https://www.amazon.com/s?k=RX+7700+XT', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7700 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 499.99, 'https://www.amazon.com/s?k=RX+7800+XT', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7800 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 549.99, 'https://www.amazon.com/s?k=RX+7900+GRE', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 GRE';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 749.99, 'https://www.amazon.com/s?k=RX+7900+XT', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 XT';

INSERT INTO prices (component_id, retailer, price, affiliate_url, in_stock)
SELECT c.id, 'Amazon', 949.99, 'https://www.amazon.com/s?k=RX+7900+XTX', true
FROM components c WHERE c.brand = 'AMD' AND c.model = 'Radeon RX 7900 XTX';
