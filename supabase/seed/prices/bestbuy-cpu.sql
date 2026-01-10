-- Best Buy CPU Prices (Jan 2025)
-- Intel CPUs
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

-- AMD CPUs
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
