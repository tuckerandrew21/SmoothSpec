"use server"

import { BestBuyClient, formatBestBuyPrice } from "@/lib/bestbuy"
import { supabase } from "@/lib/supabase"
import { API_CONFIG } from "@/lib/constants"
import { searchAllRetailers, getRetailerStatus, getRetailerSearchUrls, type RetailerName } from "@/lib/retailers"
import { getComponentPrice, type PriceResult } from "@/lib/pcpartpicker-prices"
import type { PriceInfo } from "@/types/analysis"

/**
 * Extended price info with best price indicator
 */
export interface ExtendedPriceInfo extends PriceInfo {
  isBestPrice?: boolean
}

/**
 * Retailer link info (always available, even without API pricing)
 */
export interface RetailerLink {
  retailer: RetailerName
  searchUrl: string
  price?: number
  productUrl?: string
  onSale?: boolean
}

/**
 * Result from multi-retailer price search
 */
export interface MultiRetailerPriceResult {
  prices: ExtendedPriceInfo[]
  bestPrice: { retailer: RetailerName; price: number; url: string } | null
  retailers: Record<RetailerName, boolean>
  searchUrls: Record<RetailerName, string>
  retailerLinks: RetailerLink[]
  /** PCPartPicker estimated price (primary source) */
  estimatedPrice?: number
  /** PCPartPicker product name */
  estimatedProductName?: string
}

/**
 * Rate limiter to stay under Best Buy API limits (5 req/sec)
 */
class RateLimiter {
  private lastRequest = 0
  private minInterval: number

  constructor(requestsPerSecond: number) {
    this.minInterval = 1000 / requestsPerSecond
  }

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequest

    if (timeSinceLastRequest < this.minInterval) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      )
    }

    this.lastRequest = Date.now()
    return fn()
  }
}

const rateLimiter = new RateLimiter(API_CONFIG.rateLimit)

/**
 * Check if cached price is still valid
 */
async function getCachedPrices(
  componentName: string,
  componentType: string
): Promise<PriceInfo[] | null> {
  const cacheKey = `${componentType}:${componentName}`.toLowerCase()

  // Look up component in prices table by searching component name
  const { data: components } = await supabase
    .from("components")
    .select("id, brand, model")
    .eq("type", componentType)
    .ilike("model", `%${componentName}%`)
    .limit(1)

  if (!components || components.length === 0) {
    return null
  }

  const componentId = components[0].id
  const cutoff = new Date()
  cutoff.setHours(cutoff.getHours() - API_CONFIG.cacheTtlHours)

  const { data: prices } = await supabase
    .from("prices")
    .select("*")
    .eq("component_id", componentId)
    .gte("last_updated", cutoff.toISOString())
    .eq("in_stock", true)
    .order("price", { ascending: true })

  if (!prices || prices.length === 0) {
    return null
  }

  return prices.map((p) => ({
    retailer: p.retailer,
    price: p.price,
    url: p.affiliate_url || "",
    inStock: p.in_stock,
    onSale: false, // Will be determined by Best Buy API
  }))
}

/**
 * Fetch prices from Best Buy API and cache them
 */
export async function fetchComponentPrices(
  componentName: string,
  componentType: "cpu" | "gpu" | "ram"
): Promise<PriceInfo[]> {
  try {
    // Check cache first
    const cached = await getCachedPrices(componentName, componentType)
    if (cached) {
      return cached
    }

    // Check if API key is available
    if (!process.env.BESTBUY_API_KEY) {
      console.warn("Best Buy API key not configured")
      return []
    }

    const client = new BestBuyClient(process.env.BESTBUY_API_KEY)

    // Fetch from Best Buy based on component type
    const products = await rateLimiter.throttle(async () => {
      switch (componentType) {
        case "cpu":
          return await client.searchCPUs(componentName)
        case "gpu":
          return await client.searchGPUs(componentName)
        case "ram":
          return await client.searchRAM(componentName)
        default:
          return []
      }
    })

    if (!products || products.length === 0) {
      return []
    }

    // Format and return prices with affiliate tracking
    return products.map((product) => {
      const formatted = formatBestBuyPrice(product)
      return {
        retailer: formatted.retailer,
        price: formatted.price,
        url: client.buildAffiliateUrl(formatted.affiliateUrl),
        inStock: formatted.inStock,
        onSale: formatted.onSale,
      }
    })
  } catch (error) {
    console.error("Error fetching Best Buy prices:", error)
    return []
  }
}

/**
 * Batch fetch prices for multiple recommendations
 */
export async function batchFetchPrices(
  recommendations: Array<{ name: string; type: "cpu" | "gpu" | "ram" }>
): Promise<Record<string, PriceInfo[]>> {
  const results: Record<string, PriceInfo[]> = {}

  for (const rec of recommendations) {
    const key = `${rec.type}:${rec.name}`
    results[key] = await fetchComponentPrices(rec.name, rec.type)
  }

  return results
}

/**
 * Fetch prices for a specific component by its database ID
 */
export async function fetchPricesForComponent(
  componentId: string
): Promise<PriceInfo[]> {
  // First get the component details
  const { data: component } = await supabase
    .from("components")
    .select("*")
    .eq("id", componentId)
    .single()

  if (!component) {
    return []
  }

  // Try to get cached prices from database
  const { data: dbPrices } = await supabase
    .from("prices")
    .select("*")
    .eq("component_id", componentId)
    .eq("in_stock", true)
    .order("price", { ascending: true })

  if (dbPrices && dbPrices.length > 0) {
    return dbPrices.map((p) => ({
      retailer: p.retailer,
      price: p.price,
      url: p.affiliate_url || "",
      inStock: p.in_stock,
      onSale: false,
    }))
  }

  // Fall back to Best Buy API search
  // Only fetch prices for priceable component types
  if (!isPriceableType(component.type)) {
    return []
  }

  return fetchComponentPrices(component.model, component.type)
}

/**
 * Type guard for priceable component types
 */
function isPriceableType(type: string): type is "cpu" | "gpu" | "ram" {
  return ["cpu", "gpu", "ram"].includes(type)
}

/**
 * Type guard for all component types supported by retailers
 */
function isRetailerSupportedType(type: string): type is "cpu" | "gpu" | "ram" | "storage" | "psu" {
  return ["cpu", "gpu", "ram", "storage", "psu"].includes(type)
}

/**
 * Fetch prices from all enabled retailers
 * Uses PCPartPicker as primary price source, retailers as secondary
 * Returns prices sorted by price with best price marked
 */
export async function fetchMultiRetailerPrices(
  componentName: string,
  componentType: "cpu" | "gpu" | "ram" | "storage" | "psu"
): Promise<MultiRetailerPriceResult> {
  // Always get search URLs - these work without any API keys
  const searchUrls = getRetailerSearchUrls(componentName)
  const retailers = getRetailerStatus()

  // First, try to get price from PCPartPicker dataset (fast, reliable)
  let pcpartpickerPrice: PriceResult | null = null
  try {
    pcpartpickerPrice = await getComponentPrice(componentType, componentName)
    if (pcpartpickerPrice.price) {
      console.log("[fetchMultiRetailerPrices] PCPartPicker price:", pcpartpickerPrice.price, "for", pcpartpickerPrice.productName)
    }
  } catch (err) {
    console.warn("[fetchMultiRetailerPrices] PCPartPicker lookup failed:", err)
  }

  try {
    console.log("[fetchMultiRetailerPrices] Searching for:", componentName, componentType)
    console.log("[fetchMultiRetailerPrices] Enabled retailers:", retailers)

    const result = await searchAllRetailers(componentName, componentType)
    console.log("[fetchMultiRetailerPrices] Results:", result.results.length, "retailers responded")

    // Flatten all prices from all retailers
    const allPrices: ExtendedPriceInfo[] = []

    for (const retailerResult of result.results) {
      for (const product of retailerResult.products) {
        if (product.inStock && product.price > 0) {
          allPrices.push({
            retailer: retailerResult.retailer,
            price: product.price,
            url: product.url,
            inStock: product.inStock,
            onSale: product.onSale,
            isBestPrice: result.bestPrice
              ? product.price === result.bestPrice.price &&
                retailerResult.retailer === result.bestPrice.retailer
              : false,
          })
        }
      }
    }

    // Sort by price ascending
    allPrices.sort((a, b) => a.price - b.price)

    // Build retailer links - always show all 3, with price if available
    const retailerLinks: RetailerLink[] = [
      {
        retailer: "Best Buy",
        searchUrl: searchUrls["Best Buy"],
        ...getBestPriceForRetailer(allPrices, "Best Buy"),
      },
      {
        retailer: "Amazon",
        searchUrl: searchUrls["Amazon"],
        ...getBestPriceForRetailer(allPrices, "Amazon"),
      },
      {
        retailer: "Newegg",
        searchUrl: searchUrls["Newegg"],
        ...getBestPriceForRetailer(allPrices, "Newegg"),
      },
    ]

    return {
      prices: allPrices,
      bestPrice: result.bestPrice,
      retailers,
      searchUrls,
      retailerLinks,
      // Include PCPartPicker estimated price
      estimatedPrice: pcpartpickerPrice?.price ?? undefined,
      estimatedProductName: pcpartpickerPrice?.productName ?? undefined,
    }
  } catch (error) {
    console.error("Error fetching multi-retailer prices:", error)
    // Even on error, return search URLs and PCPartPicker price if available
    return {
      prices: [],
      bestPrice: null,
      retailers,
      searchUrls,
      retailerLinks: [
        { retailer: "Best Buy", searchUrl: searchUrls["Best Buy"] },
        { retailer: "Amazon", searchUrl: searchUrls["Amazon"] },
        { retailer: "Newegg", searchUrl: searchUrls["Newegg"] },
      ],
      estimatedPrice: pcpartpickerPrice?.price ?? undefined,
      estimatedProductName: pcpartpickerPrice?.productName ?? undefined,
    }
  }
}

/**
 * Helper to get the best price for a specific retailer from the prices array
 */
function getBestPriceForRetailer(
  prices: ExtendedPriceInfo[],
  retailer: RetailerName
): { price?: number; productUrl?: string; onSale?: boolean } {
  const retailerPrices = prices.filter((p) => p.retailer === retailer)
  if (retailerPrices.length === 0) return {}
  const best = retailerPrices[0] // Already sorted by price ascending
  return {
    price: best.price,
    productUrl: best.url,
    onSale: best.onSale,
  }
}

/**
 * Synthetic component IDs and their search queries
 */
const SYNTHETIC_COMPONENTS: Record<string, { query: string; type: "cpu" | "gpu" | "ram" | "storage" | "psu" }> = {
  "ram-upgrade": { query: "DDR5 32GB RAM kit", type: "ram" },
  "storage-nvme": { query: "1TB NVMe SSD", type: "storage" },
}

/**
 * Fetch prices for a component from all retailers by its database ID
 * Also handles synthetic component IDs for RAM/storage upgrades
 */
export async function fetchMultiRetailerPricesForComponent(
  componentId: string
): Promise<MultiRetailerPriceResult> {
  console.log("[fetchMultiRetailerPricesForComponent] Called with ID:", componentId)

  // Check if this is a synthetic component (RAM/storage upgrade)
  const synthetic = SYNTHETIC_COMPONENTS[componentId]
  if (synthetic) {
    console.log("[fetchMultiRetailerPricesForComponent] Synthetic component:", synthetic.query, synthetic.type)
    return fetchMultiRetailerPrices(synthetic.query, synthetic.type)
  }

  // First get the component details from database
  const { data: component, error } = await supabase
    .from("components")
    .select("*")
    .eq("id", componentId)
    .single()

  if (error) {
    console.log("[fetchMultiRetailerPricesForComponent] DB error:", error.message)
  }

  if (!component) {
    console.log("[fetchMultiRetailerPricesForComponent] No component found")
    const emptySearchUrls = getRetailerSearchUrls("computer component")
    return {
      prices: [],
      bestPrice: null,
      retailers: getRetailerStatus(),
      searchUrls: emptySearchUrls,
      retailerLinks: [
        { retailer: "Best Buy", searchUrl: emptySearchUrls["Best Buy"] },
        { retailer: "Amazon", searchUrl: emptySearchUrls["Amazon"] },
        { retailer: "Newegg", searchUrl: emptySearchUrls["Newegg"] },
      ],
    }
  }

  console.log("[fetchMultiRetailerPricesForComponent] Found component:", component.brand, component.model, component.type)

  if (!isRetailerSupportedType(component.type)) {
    // Still return search URLs even for unsupported types
    const searchUrls = getRetailerSearchUrls(component.model)
    return {
      prices: [],
      bestPrice: null,
      retailers: getRetailerStatus(),
      searchUrls,
      retailerLinks: [
        { retailer: "Best Buy", searchUrl: searchUrls["Best Buy"] },
        { retailer: "Amazon", searchUrl: searchUrls["Amazon"] },
        { retailer: "Newegg", searchUrl: searchUrls["Newegg"] },
      ],
    }
  }

  return fetchMultiRetailerPrices(component.model, component.type)
}

/**
 * Get retailer links for a component by name (simpler API for UI)
 * Always returns all 3 retailers with search URLs
 * Best Buy will include price if API is configured
 */
export async function getRetailerLinksForComponent(
  componentName: string,
  componentType: "cpu" | "gpu" | "ram" | "storage" | "psu"
): Promise<RetailerLink[]> {
  const result = await fetchMultiRetailerPrices(componentName, componentType)
  return result.retailerLinks
}
