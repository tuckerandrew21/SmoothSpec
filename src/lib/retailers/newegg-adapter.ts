/**
 * Newegg Adapter
 * Stub implementation for Newegg API
 *
 * Note: Newegg has limited public API access.
 * Consider using their affiliate program for product links.
 *
 * To enable:
 * 1. Apply at https://www.newegg.com/sellers/
 * 2. Set environment variables:
 *    - NEWEGG_API_KEY
 *    - NEWEGG_SECRET_KEY
 */

import type { RetailerClient, RetailerProduct } from "./types"

export class NeweggAdapter implements RetailerClient {
  readonly name = "Newegg" as const
  readonly enabled: boolean

  constructor() {
    // Check if Newegg API credentials are available
    this.enabled = !!(
      process.env.NEWEGG_API_KEY &&
      process.env.NEWEGG_SECRET_KEY
    )
  }

  async searchCPUs(_model: string): Promise<RetailerProduct[]> {
    if (!this.enabled) return []
    // TODO: Implement Newegg API integration when API access is available
    return []
  }

  async searchGPUs(_model: string): Promise<RetailerProduct[]> {
    if (!this.enabled) return []
    return []
  }

  async searchRAM(_model: string): Promise<RetailerProduct[]> {
    if (!this.enabled) return []
    return []
  }

  async searchStorage(_model: string): Promise<RetailerProduct[]> {
    if (!this.enabled) return []
    return []
  }

  async searchPSU(_model: string): Promise<RetailerProduct[]> {
    if (!this.enabled) return []
    return []
  }

  buildAffiliateUrl(productUrl: string): string {
    // Newegg affiliate links are typically generated through their portal
    // or through affiliate networks like CJ Affiliate
    return productUrl
  }

  buildSearchUrl(query: string): string {
    const encoded = encodeURIComponent(query)
    // Newegg search URL - affiliate tracking can be added via CJ Affiliate later
    return `https://www.newegg.com/p/pl?d=${encoded}`
  }
}
