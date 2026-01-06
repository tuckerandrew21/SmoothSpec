/**
 * PCPartPicker Prices Service
 *
 * Provides price lookups from the PCPartPicker dataset stored in Supabase.
 * This is the primary price source - faster and more reliable than retailer APIs.
 */

import { supabase } from "./supabase"

export interface PriceResult {
  price: number | null
  productName: string | null
  chipset: string | null
  source: "pcpartpicker"
  specs?: Record<string, unknown>
}

export interface MultiPriceResult {
  lowestPrice: number | null
  highestPrice: number | null
  averagePrice: number | null
  products: Array<{
    name: string
    price: number
    chipset: string | null
    specs: Record<string, unknown>
  }>
  source: "pcpartpicker"
}

/**
 * Get lowest price for a GPU by chipset name
 * @param chipset GPU chipset (e.g., "Radeon RX 7800 XT" or "GeForce RTX 4070")
 */
export async function getGPUPrice(chipset: string): Promise<PriceResult> {
  // Normalize chipset name for search
  const normalizedChipset = chipset
    .replace(/^AMD\s+/i, "")
    .replace(/^NVIDIA\s+/i, "")
    .trim()

  const { data, error } = await supabase
    .from("pcpartpicker_prices")
    .select("name, price, chipset, specs")
    .eq("category", "gpu")
    .ilike("chipset", `%${normalizedChipset}%`)
    .not("price", "is", null)
    .order("price", { ascending: true })
    .limit(1)

  if (error || !data || data.length === 0) {
    return { price: null, productName: null, chipset: null, source: "pcpartpicker" }
  }

  return {
    price: data[0].price,
    productName: data[0].name,
    chipset: data[0].chipset,
    source: "pcpartpicker",
    specs: data[0].specs,
  }
}

/**
 * Get multiple GPU prices for price range display
 * @param chipset GPU chipset (e.g., "Radeon RX 7800 XT")
 */
export async function getGPUPriceRange(chipset: string): Promise<MultiPriceResult> {
  const normalizedChipset = chipset
    .replace(/^AMD\s+/i, "")
    .replace(/^NVIDIA\s+/i, "")
    .trim()

  const { data, error } = await supabase
    .from("pcpartpicker_prices")
    .select("name, price, chipset, specs")
    .eq("category", "gpu")
    .ilike("chipset", `%${normalizedChipset}%`)
    .not("price", "is", null)
    .order("price", { ascending: true })
    .limit(20)

  if (error || !data || data.length === 0) {
    return { lowestPrice: null, highestPrice: null, averagePrice: null, products: [], source: "pcpartpicker" }
  }

  const prices = data.map((d) => d.price as number)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length

  return {
    lowestPrice: prices[0],
    highestPrice: prices[prices.length - 1],
    averagePrice: Math.round(avgPrice * 100) / 100,
    products: data.map((d) => ({
      name: d.name,
      price: d.price as number,
      chipset: d.chipset,
      specs: d.specs as Record<string, unknown>,
    })),
    source: "pcpartpicker",
  }
}

/**
 * Get lowest price for a CPU by model name
 * @param model CPU model (e.g., "Ryzen 7 7800X3D" or "Core i7-14700K")
 */
export async function getCPUPrice(model: string): Promise<PriceResult> {
  // Normalize model name for search
  const normalizedModel = model
    .replace(/^AMD\s+/i, "")
    .replace(/^Intel\s+/i, "")
    .trim()

  const { data, error } = await supabase
    .from("pcpartpicker_prices")
    .select("name, price, chipset, specs")
    .eq("category", "cpu")
    .ilike("chipset", `%${normalizedModel}%`)
    .not("price", "is", null)
    .order("price", { ascending: true })
    .limit(1)

  if (error || !data || data.length === 0) {
    return { price: null, productName: null, chipset: null, source: "pcpartpicker" }
  }

  return {
    price: data[0].price,
    productName: data[0].name,
    chipset: data[0].chipset,
    source: "pcpartpicker",
    specs: data[0].specs,
  }
}

/**
 * Get lowest price for RAM by specs
 * Uses chipset-based search for reliability (indexed column)
 * @param ddrVersion DDR version (4 or 5)
 * @param totalGB Total GB (e.g., 16, 32, 64)
 * @param speedMHz Optional speed in MHz (used in chipset pattern)
 */
export async function getRAMPrice(
  ddrVersion: number,
  totalGB: number,
  speedMHz?: number
): Promise<PriceResult> {
  // Build chipset pattern: "DDR5-6000 32GB (2x16GB)" format
  // Primary search: match DDR version and total GB
  const chipsetPattern = speedMHz
    ? `DDR${ddrVersion}-${speedMHz}%${totalGB}GB%`
    : `DDR${ddrVersion}%${totalGB}GB%`

  const { data, error } = await supabase
    .from("pcpartpicker_prices")
    .select("name, price, chipset, specs")
    .eq("category", "ram")
    .ilike("chipset", chipsetPattern)
    .not("price", "is", null)
    .order("price", { ascending: true })
    .limit(1)

  if (error || !data || data.length === 0) {
    // Broader fallback: just DDR version and GB without speed
    if (speedMHz) {
      const broaderPattern = `DDR${ddrVersion}%${totalGB}GB%`
      const { data: fallbackData } = await supabase
        .from("pcpartpicker_prices")
        .select("name, price, chipset, specs")
        .eq("category", "ram")
        .ilike("chipset", broaderPattern)
        .not("price", "is", null)
        .order("price", { ascending: true })
        .limit(1)

      if (fallbackData && fallbackData.length > 0) {
        return {
          price: fallbackData[0].price,
          productName: fallbackData[0].name,
          chipset: fallbackData[0].chipset,
          source: "pcpartpicker",
          specs: fallbackData[0].specs,
        }
      }
    }
    return { price: null, productName: null, chipset: null, source: "pcpartpicker" }
  }

  return {
    price: data[0].price,
    productName: data[0].name,
    chipset: data[0].chipset,
    source: "pcpartpicker",
    specs: data[0].specs,
  }
}

/**
 * Get lowest price for storage by type and capacity
 * @param type Storage type ("ssd" or "hdd")
 * @param capacityGB Capacity in GB
 * @param nvme Whether to prefer NVMe drives (for SSDs)
 */
export async function getStoragePrice(
  type: "ssd" | "hdd",
  capacityGB: number,
  nvme?: boolean
): Promise<PriceResult> {
  // Build chipset pattern: "1TB NVMe SSD" or "2TB HDD"
  const capacityStr = capacityGB >= 1000 ? `${Math.round(capacityGB / 1000)}TB` : `${capacityGB}GB`
  const nvmeStr = nvme ? "NVMe " : ""
  const chipsetPattern = `${capacityStr} ${nvmeStr}${type.toUpperCase()}`

  const { data, error } = await supabase
    .from("pcpartpicker_prices")
    .select("name, price, chipset, specs")
    .eq("category", "storage")
    .ilike("chipset", `%${chipsetPattern}%`)
    .not("price", "is", null)
    .order("price", { ascending: true })
    .limit(1)

  if (error || !data || data.length === 0) {
    // Try a broader search
    const broadPattern = `${capacityStr}%${type.toUpperCase()}`
    const { data: fallbackData } = await supabase
      .from("pcpartpicker_prices")
      .select("name, price, chipset, specs")
      .eq("category", "storage")
      .ilike("chipset", broadPattern)
      .not("price", "is", null)
      .order("price", { ascending: true })
      .limit(1)

    if (!fallbackData || fallbackData.length === 0) {
      return { price: null, productName: null, chipset: null, source: "pcpartpicker" }
    }

    return {
      price: fallbackData[0].price,
      productName: fallbackData[0].name,
      chipset: fallbackData[0].chipset,
      source: "pcpartpicker",
      specs: fallbackData[0].specs,
    }
  }

  return {
    price: data[0].price,
    productName: data[0].name,
    chipset: data[0].chipset,
    source: "pcpartpicker",
    specs: data[0].specs,
  }
}

/**
 * Get lowest price for PSU by wattage
 * Uses chipset-based search for reliability (indexed column)
 * @param wattage PSU wattage (e.g., 650, 750, 850)
 * @param efficiency Optional efficiency rating (e.g., "80+ Gold")
 */
export async function getPSUPrice(wattage: number, efficiency?: string): Promise<PriceResult> {
  // Build chipset pattern: "850W 80+ Gold" format
  const chipsetPattern = efficiency ? `${wattage}W%${efficiency}%` : `${wattage}W%`

  const { data, error } = await supabase
    .from("pcpartpicker_prices")
    .select("name, price, chipset, specs")
    .eq("category", "psu")
    .ilike("chipset", chipsetPattern)
    .not("price", "is", null)
    .order("price", { ascending: true })
    .limit(1)

  if (error || !data || data.length === 0) {
    // Broader fallback: just wattage without efficiency
    if (efficiency) {
      const broaderPattern = `${wattage}W%`
      const { data: fallbackData } = await supabase
        .from("pcpartpicker_prices")
        .select("name, price, chipset, specs")
        .eq("category", "psu")
        .ilike("chipset", broaderPattern)
        .not("price", "is", null)
        .order("price", { ascending: true })
        .limit(1)

      if (fallbackData && fallbackData.length > 0) {
        return {
          price: fallbackData[0].price,
          productName: fallbackData[0].name,
          chipset: fallbackData[0].chipset,
          source: "pcpartpicker",
          specs: fallbackData[0].specs,
        }
      }
    }
    return { price: null, productName: null, chipset: null, source: "pcpartpicker" }
  }

  return {
    price: data[0].price,
    productName: data[0].name,
    chipset: data[0].chipset,
    source: "pcpartpicker",
    specs: data[0].specs,
  }
}

/**
 * Get price for a component by type and model name
 * Generic function that routes to the appropriate category function
 */
export async function getComponentPrice(
  componentType: "cpu" | "gpu" | "ram" | "storage" | "psu",
  model: string
): Promise<PriceResult> {
  switch (componentType) {
    case "gpu":
      return getGPUPrice(model)
    case "cpu":
      return getCPUPrice(model)
    case "ram":
      // Try to parse DDR version and GB from model
      // Format: "DDR5 32GB" or similar
      const ramMatch = model.match(/DDR(\d)\s*(\d+)\s*GB/i)
      if (ramMatch) {
        return getRAMPrice(parseInt(ramMatch[1]), parseInt(ramMatch[2]))
      }
      // Default to DDR5 32GB if we can't parse
      return getRAMPrice(5, 32)
    case "storage":
      // Try to parse capacity and type from model
      // Format: "1TB NVMe SSD" or "2TB HDD"
      const ssdMatch = model.match(/(\d+)\s*(TB|GB)\s*(NVMe\s*)?(SSD)/i)
      if (ssdMatch) {
        const capacity = ssdMatch[2].toUpperCase() === "TB" ? parseInt(ssdMatch[1]) * 1000 : parseInt(ssdMatch[1])
        const isNvme = !!ssdMatch[3]
        return getStoragePrice("ssd", capacity, isNvme)
      }
      const hddMatch = model.match(/(\d+)\s*(TB|GB)\s*HDD/i)
      if (hddMatch) {
        const capacity = hddMatch[2].toUpperCase() === "TB" ? parseInt(hddMatch[1]) * 1000 : parseInt(hddMatch[1])
        return getStoragePrice("hdd", capacity)
      }
      // Default to 1TB SSD
      return getStoragePrice("ssd", 1000, true)
    case "psu":
      // Try to parse wattage from model
      // Format: "750W" or "850W 80+ Gold"
      const psuMatch = model.match(/(\d+)\s*W/)
      if (psuMatch) {
        const efficiencyMatch = model.match(/80\+\s*(Bronze|Silver|Gold|Platinum|Titanium)/i)
        return getPSUPrice(parseInt(psuMatch[1]), efficiencyMatch ? `80+ ${efficiencyMatch[1]}` : undefined)
      }
      // Default to 750W
      return getPSUPrice(750)
    default:
      return { price: null, productName: null, chipset: null, source: "pcpartpicker" }
  }
}

/**
 * Escape special characters in LIKE patterns to prevent unexpected matches
 */
function escapeLikePattern(pattern: string): string {
  return pattern.replace(/[%_\\]/g, "\\$&")
}

/**
 * Search for products by name across all categories or a specific category
 * @param query Search query
 * @param category Optional category to filter by
 */
export async function searchProducts(
  query: string,
  category?: "cpu" | "gpu" | "ram" | "storage" | "psu"
): Promise<MultiPriceResult> {
  // Sanitize query to escape LIKE special characters
  const sanitizedQuery = escapeLikePattern(query)

  let dbQuery = supabase
    .from("pcpartpicker_prices")
    .select("name, price, chipset, specs, category")
    .not("price", "is", null)
    .or(`name.ilike.%${sanitizedQuery}%,chipset.ilike.%${sanitizedQuery}%`)
    .order("price", { ascending: true })
    .limit(20)

  if (category) {
    dbQuery = dbQuery.eq("category", category)
  }

  const { data, error } = await dbQuery

  if (error || !data || data.length === 0) {
    return { lowestPrice: null, highestPrice: null, averagePrice: null, products: [], source: "pcpartpicker" }
  }

  const prices = data.map((d) => d.price as number)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length

  return {
    lowestPrice: prices[0],
    highestPrice: prices[prices.length - 1],
    averagePrice: Math.round(avgPrice * 100) / 100,
    products: data.map((d) => ({
      name: d.name,
      price: d.price as number,
      chipset: d.chipset,
      specs: d.specs as Record<string, unknown>,
    })),
    source: "pcpartpicker",
  }
}
