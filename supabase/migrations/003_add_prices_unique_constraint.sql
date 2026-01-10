-- Migration: Add unique constraint to prices table for upsert operations
-- This enables the nightly price sync to use ON CONFLICT for upserts

-- First, remove any duplicates (keep the most recent)
DELETE FROM prices p1
WHERE p1.id NOT IN (
  SELECT DISTINCT ON (component_id, retailer) id
  FROM prices
  ORDER BY component_id, retailer, last_updated DESC NULLS LAST
);

-- Add unique constraint on (component_id, retailer)
ALTER TABLE prices
ADD CONSTRAINT prices_component_retailer_unique
UNIQUE (component_id, retailer);
