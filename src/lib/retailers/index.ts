/**
 * Retailer Registry
 * Provides a unified interface for fetching prices from multiple retailers
 */

import { BestBuyAdapter } from "./bestbuy-adapter"
import { AmazonAdapter } from "./amazon-adapter"
import { NeweggAdapter } from "./newegg-adapter"
import type {
  RetailerClient,
  RetailerProduct,
  RetailerSearchResult,
  MultiRetailerResult,
  RetailerName,
} from "./types"

export type { RetailerClient, RetailerProduct, RetailerSearchResult, MultiRetailerResult, RetailerName } from "./types"

/**
 * Lazily create retailers to ensure env vars are available
 */
let _retailers: RetailerClient[] | null = null

function getRetailers(): RetailerClient[] {
  if (!_retailers) {
    _retailers = [
      new BestBuyAdapter(),
      new AmazonAdapter(),
      new NeweggAdapter(),
    ]
  }
  return _retailers
}

/**
 * Get all enabled retailers
 */
export function getEnabledRetailers(): RetailerClient[] {
  return getRetailers().filter((r) => r.enabled)
}

/**
 * Get retailer by name
 */
export function getRetailer(name: RetailerName): RetailerClient | undefined {
  return getRetailers().find((r) => r.name === name)
}

/**
 * Check which retailers are currently enabled
 */
export function getRetailerStatus(): Record<RetailerName, boolean> {
  const retailers = getRetailers()
  return {
    "Best Buy": retailers.find((r) => r.name === "Best Buy")?.enabled ?? false,
    "Amazon": retailers.find((r) => r.name === "Amazon")?.enabled ?? false,
    "Newegg": retailers.find((r) => r.name === "Newegg")?.enabled ?? false,
  }
}

type ComponentType = "cpu" | "gpu" | "ram" | "storage" | "psu"

/**
 * Search all enabled retailers for a component
 */
export async function searchAllRetailers(
  model: string,
  componentType: ComponentType
): Promise<MultiRetailerResult> {
  const enabledRetailers = getEnabledRetailers()
  const results: RetailerSearchResult[] = []

  // Search each retailer in parallel
  const searchPromises = enabledRetailers.map(async (retailer) => {
    try {
      let products: RetailerProduct[] = []
      switch (componentType) {
        case "cpu":
          products = await retailer.searchCPUs(model)
          break
        case "gpu":
          products = await retailer.searchGPUs(model)
          break
        case "ram":
          products = await retailer.searchRAM(model)
          break
        case "storage":
          products = await retailer.searchStorage(model)
          break
        case "psu":
          products = await retailer.searchPSU(model)
          break
        default:
          products = []
      }

      console.log(`[searchAllRetailers] ${retailer.name} returned ${products.length} products for query "${model}"`)
      if (products.length > 0) {
        console.log(`[searchAllRetailers] First product:`, products[0].name, products[0].price, products[0].inStock)
        const inStockCount = products.filter(p => p.inStock).length
        const withPriceCount = products.filter(p => p.price > 0).length
        console.log(`[searchAllRetailers] ${inStockCount}/${products.length} in stock, ${withPriceCount}/${products.length} with price`)
      }

      // Apply affiliate URLs
      const productsWithAffiliateUrls = products.map((p) => ({
        ...p,
        url: retailer.buildAffiliateUrl(p.url),
      }))

      return {
        retailer: retailer.name,
        products: productsWithAffiliateUrls,
      } as RetailerSearchResult
    } catch (error) {
      console.error(`[searchAllRetailers] ${retailer.name} error:`, error)
      return {
        retailer: retailer.name,
        products: [],
        error: error instanceof Error ? error.message : "Unknown error",
      } as RetailerSearchResult
    }
  })

  const searchResults = await Promise.all(searchPromises)
  results.push(...searchResults)

  // Find best price across all retailers
  let bestPrice: MultiRetailerResult["bestPrice"] = null
  for (const result of results) {
    for (const product of result.products) {
      if (product.inStock && product.price > 0) {
        if (!bestPrice || product.price < bestPrice.price) {
          bestPrice = {
            retailer: result.retailer,
            price: product.price,
            url: product.url,
          }
        }
      }
    }
  }

  return { results, bestPrice }
}

/**
 * Get the best price for a component across all retailers
 */
export async function getBestPrice(
  model: string,
  componentType: ComponentType
): Promise<{ retailer: RetailerName; price: number; url: string } | null> {
  const result = await searchAllRetailers(model, componentType)
  return result.bestPrice
}
