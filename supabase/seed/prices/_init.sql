-- Price Seed Initialization
-- Run FIRST before other price files
-- Clears old prices to ensure fresh data

DELETE FROM prices WHERE retailer = 'Best Buy';
DELETE FROM prices WHERE retailer = 'Amazon';
DELETE FROM prices WHERE retailer = 'Newegg';
