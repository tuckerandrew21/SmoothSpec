-- Migration: Add PCPartPicker prices table
-- Run this in Supabase SQL Editor to add the new table

-- Ensure the updated_at trigger function exists (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PCPartPicker prices table (for aggregated pricing data from PCPartPicker)
CREATE TABLE IF NOT EXISTS pcpartpicker_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('gpu', 'cpu', 'ram', 'storage', 'psu')),
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  specs JSONB DEFAULT '{}',
  chipset TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, name)
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_pcpp_category ON pcpartpicker_prices(category);
CREATE INDEX IF NOT EXISTS idx_pcpp_chipset ON pcpartpicker_prices(chipset);
CREATE INDEX IF NOT EXISTS idx_pcpp_price ON pcpartpicker_prices(price);

-- GIN index for JSONB queries on specs column
CREATE INDEX IF NOT EXISTS idx_pcpp_specs ON pcpartpicker_prices USING GIN (specs);

-- Composite index for upsert operations (category, name)
CREATE INDEX IF NOT EXISTS idx_pcpp_category_name ON pcpartpicker_prices(category, name);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_pcpartpicker_prices_updated_at ON pcpartpicker_prices;
CREATE TRIGGER update_pcpartpicker_prices_updated_at
  BEFORE UPDATE ON pcpartpicker_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
