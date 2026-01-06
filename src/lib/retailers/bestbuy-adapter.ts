/**
 * Best Buy Adapter
 * Wraps the existing BestBuyClient to conform to RetailerClient interface
 */

import { BestBuyClient } from "../bestbuy"
import type { RetailerClient, RetailerProduct } from "./types"

export class BestBuyAdapter implements RetailerClient {
  readonly name = "Best Buy" as const
  readonly enabled: boolean
  private client: BestBuyClient | null = null

  constructor() {
    this.enabled = !!process.env.BESTBUY_API_KEY
    if (this.enabled) {
      try {
        this.client = new BestBuyClient(process.env.BESTBUY_API_KEY)
      } catch {
        this.enabled = false
      }
    }
  }

  private formatProduct(product: {
    sku: number
    name: string
    salePrice: number
    regularPrice: number
    onSale: boolean
    url: string
    onlineAvailability: boolean
    inStoreAvailability: boolean
    image?: string
  }): RetailerProduct {
    return {
      sku: product.sku.toString(),
      name: product.name,
      price: product.salePrice || product.regularPrice,
      regularPrice: product.regularPrice,
      onSale: product.onSale,
      url: product.url,
      inStock: product.onlineAvailability || product.inStoreAvailability,
      image: product.image,
    }
  }

  async searchCPUs(model: string): Promise<RetailerProduct[]> {
    if (!this.client) return []
    const products = await this.client.searchCPUs(model)
    return products.map((p) => this.formatProduct(p))
  }

  async searchGPUs(model: string): Promise<RetailerProduct[]> {
    if (!this.client) return []
    const products = await this.client.searchGPUs(model)
    return products.map((p) => this.formatProduct(p))
  }

  async searchRAM(model: string): Promise<RetailerProduct[]> {
    if (!this.client) return []
    const products = await this.client.searchRAM(model)
    return products.map((p) => this.formatProduct(p))
  }

  async searchStorage(model: string): Promise<RetailerProduct[]> {
    if (!this.client) return []
    const products = await this.client.searchStorage(model)
    return products.map((p) => this.formatProduct(p))
  }

  async searchPSU(model: string): Promise<RetailerProduct[]> {
    if (!this.client) return []
    const products = await this.client.searchPSU(model)
    return products.map((p) => this.formatProduct(p))
  }

  buildAffiliateUrl(productUrl: string): string {
    if (!this.client) return productUrl
    return this.client.buildAffiliateUrl(productUrl)
  }

  buildSearchUrl(query: string): string {
    const encoded = encodeURIComponent(query)
    const affiliateId = process.env.BESTBUY_AFFILIATE_ID
    const baseUrl = `https://www.bestbuy.com/site/searchpage.jsp?st=${encoded}`
    // If we have an affiliate ID, wrap in Impact Radius tracking
    if (affiliateId) {
      const encodedSearchUrl = encodeURIComponent(baseUrl)
      return `https://bestbuy.7tiv.net/c/${affiliateId}/614286/10014?u=${encodedSearchUrl}`
    }
    return baseUrl
  }
}
