-- Migration: Add family column to components table
-- Purpose: Enable cascading dropdown selection (Brand → Family → Model)

-- Add family column
ALTER TABLE components ADD COLUMN IF NOT EXISTS family TEXT;

-- Create composite index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_components_type_brand_family
ON components(type, brand, family);

-- Add comment for documentation
COMMENT ON COLUMN components.family IS 'Component generation/series (e.g., "14th Gen", "RTX 40 Series", "Ryzen 7000")';
