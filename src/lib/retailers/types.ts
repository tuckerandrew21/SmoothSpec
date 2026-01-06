/**
 * Retailer Types
 * Common interfaces for multi-retailer price fetching
 */

export type RetailerName = "Best Buy" | "Amazon" | "Newegg"

export interface RetailerProduct {
  sku: string
  name: string
  price: number
  regularPrice?: number
  onSale: boolean
  url: string
  inStock: boolean
  image?: string
}

export interface RetailerSearchResult {
  retailer: RetailerName
  products: RetailerProduct[]
  error?: string
}

export interface RetailerClient {
  readonly name: RetailerName
  readonly enabled: boolean
  searchCPUs(model: string): Promise<RetailerProduct[]>
  searchGPUs(model: string): Promise<RetailerProduct[]>
  searchRAM(model: string): Promise<RetailerProduct[]>
  searchStorage(model: string): Promise<RetailerProduct[]>
  searchPSU(model: string): Promise<RetailerProduct[]>
  buildAffiliateUrl(productUrl: string): string
  buildSearchUrl(query: string): string
}

export interface MultiRetailerResult {
  results: RetailerSearchResult[]
  bestPrice: {
    retailer: RetailerName
    price: number
    url: string
  } | null
}
