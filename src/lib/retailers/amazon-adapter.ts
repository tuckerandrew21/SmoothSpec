/**
 * Amazon Adapter
 * Stub implementation for Amazon Product Advertising API
 *
 * To enable:
 * 1. Sign up at https://affiliate-program.amazon.com/
 * 2. Apply for Product Advertising API access
 * 3. Set environment variables:
 *    - AMAZON_ACCESS_KEY
 *    - AMAZON_SECRET_KEY
 *    - AMAZON_PARTNER_TAG
 */

import type { RetailerClient, RetailerProduct } from "./types"

export class AmazonAdapter implements RetailerClient {
  readonly name = "Amazon" as const
  readonly enabled: boolean

  constructor() {
    // Check if all required Amazon API credentials are available
    this.enabled = !!(
      process.env.AMAZON_ACCESS_KEY &&
      process.env.AMAZON_SECRET_KEY &&
      process.env.AMAZON_PARTNER_TAG
    )
  }

  async searchCPUs(_model: string): Promise<RetailerProduct[]> {
    if (!this.enabled) return []
    // TODO: Implement Amazon Product Advertising API integration
    // API Docs: https://webservices.amazon.com/paapi5/documentation/
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
    const partnerTag = process.env.AMAZON_PARTNER_TAG
    if (!partnerTag) return productUrl

    try {
      const url = new URL(productUrl)
      url.searchParams.set("tag", partnerTag)
      return url.toString()
    } catch {
      return productUrl
    }
  }

  buildSearchUrl(query: string): string {
    const encoded = encodeURIComponent(query)
    const partnerTag = process.env.AMAZON_PARTNER_TAG
    const baseUrl = `https://www.amazon.com/s?k=${encoded}`
    return partnerTag ? `${baseUrl}&tag=${partnerTag}` : baseUrl
  }
}
