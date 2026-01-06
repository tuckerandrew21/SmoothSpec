-- Smoothspec Database Schema
-- Run this in Supabase SQL Editor

-- Components table (CPUs, GPUs, RAM, Storage, PSUs)
CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('cpu', 'gpu', 'ram', 'storage', 'psu')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  release_year INTEGER,
  benchmark_score INTEGER,
  category_scores JSONB DEFAULT '{}',
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  steam_id TEXT,
  image_url TEXT,
  cpu_weight DECIMAL(3,2) DEFAULT 1.0,
  gpu_weight DECIMAL(3,2) DEFAULT 1.0,
  ram_requirement INTEGER DEFAULT 16,
  recommended_specs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prices table
CREATE TABLE IF NOT EXISTS prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID REFERENCES components(id) ON DELETE CASCADE,
  retailer TEXT NOT NULL,
  price DECIMAL(10,2),
  affiliate_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Builds table (for future saved builds feature)
CREATE TABLE IF NOT EXISTS builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT,
  components JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PCPartPicker prices table (for aggregated pricing data)
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_components_type ON components(type);
CREATE INDEX IF NOT EXISTS idx_components_brand ON components(brand);
CREATE INDEX IF NOT EXISTS idx_prices_component_id ON prices(component_id);
CREATE INDEX IF NOT EXISTS idx_prices_retailer ON prices(retailer);
CREATE INDEX IF NOT EXISTS idx_games_name ON games(name);
CREATE INDEX IF NOT EXISTS idx_pcpp_category ON pcpartpicker_prices(category);
CREATE INDEX IF NOT EXISTS idx_pcpp_chipset ON pcpartpicker_prices(chipset);
CREATE INDEX IF NOT EXISTS idx_pcpp_price ON pcpartpicker_prices(price);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_components_updated_at ON components;
CREATE TRIGGER update_components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_games_updated_at ON games;
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_builds_updated_at ON builds;
CREATE TRIGGER update_builds_updated_at
  BEFORE UPDATE ON builds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pcpartpicker_prices_updated_at ON pcpartpicker_prices;
CREATE TRIGGER update_pcpartpicker_prices_updated_at
  BEFORE UPDATE ON pcpartpicker_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
