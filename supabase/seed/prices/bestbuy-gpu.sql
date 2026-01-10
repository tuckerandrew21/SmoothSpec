-- Best Buy GPU Prices (Jan 2025)
-- NVIDIA GPUs
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

-- AMD GPUs
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
