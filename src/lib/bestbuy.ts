/**
 * Best Buy API Integration for Smoothspec
 *
 * API Documentation: https://developer.bestbuy.com/documentation
 *
 * Rate Limits:
 * - 5 queries per second
 * - 50,000 queries per day
 */

const BESTBUY_API_BASE = 'https://api.bestbuy.com/v1'

interface BestBuyProduct {
  sku: number
  name: string
  salePrice: number
  regularPrice: number
  onSale: boolean
  url: string
  addToCartUrl: string
  inStoreAvailability: boolean
  onlineAvailability: boolean
  image: string
  manufacturer: string
  modelNumber: string
  upc: string
}

interface BestBuySearchResponse {
  from: number
  to: number
  total: number
  currentPage: number
  totalPages: number
  products: BestBuyProduct[]
}

export class BestBuyClient {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.BESTBUY_API_KEY || ''
    if (!this.apiKey) {
      throw new Error('Best Buy API key is required')
    }
  }

  /**
   * Search for products by query string
   */
  async searchProducts(query: string, options?: {
    pageSize?: number
    page?: number
    categoryId?: string
  }): Promise<BestBuySearchResponse> {
    const { pageSize = 10, page = 1, categoryId } = options || {}

    // Build search query
    let searchQuery = `(search=${encodeURIComponent(query)})`
    if (categoryId) {
      searchQuery += `&(categoryPath.id=${categoryId})`
    }

    const url = new URL(`${BESTBUY_API_BASE}/products${searchQuery}`)
    url.searchParams.set('apiKey', this.apiKey)
    url.searchParams.set('format', 'json')
    url.searchParams.set('pageSize', pageSize.toString())
    url.searchParams.set('page', page.toString())
    url.searchParams.set('show', 'sku,name,salePrice,regularPrice,onSale,url,addToCartUrl,inStoreAvailability,onlineAvailability,image,manufacturer,modelNumber,upc')

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Best Buy API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get product by SKU
   */
  async getProductBySku(sku: number): Promise<BestBuyProduct | null> {
    const url = new URL(`${BESTBUY_API_BASE}/products/${sku}.json`)
    url.searchParams.set('apiKey', this.apiKey)
    url.searchParams.set('show', 'sku,name,salePrice,regularPrice,onSale,url,addToCartUrl,inStoreAvailability,onlineAvailability,image,manufacturer,modelNumber,upc')

    const response = await fetch(url.toString())

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`Best Buy API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Search for CPUs
   */
  async searchCPUs(model: string): Promise<BestBuyProduct[]> {
    // Category ID for Computer Processors: abcat0507010
    const result = await this.searchProducts(model, {
      categoryId: 'abcat0507010',
      pageSize: 5,
    })
    return result.products
  }

  /**
   * Search for GPUs/Graphics Cards
   */
  async searchGPUs(model: string): Promise<BestBuyProduct[]> {
    // Category ID for Graphics Cards: abcat0507002
    const result = await this.searchProducts(model, {
      categoryId: 'abcat0507002',
      pageSize: 5,
    })
    return result.products
  }

  /**
   * Search for RAM
   */
  async searchRAM(model: string): Promise<BestBuyProduct[]> {
    // Category ID for Computer Memory: abcat0503000
    const result = await this.searchProducts(model, {
      categoryId: 'abcat0503000',
      pageSize: 5,
    })
    return result.products
  }

  /**
   * Search for Storage/SSDs
   */
  async searchStorage(model: string): Promise<BestBuyProduct[]> {
    // Category ID for Internal SSDs: pcmcat219400050004
    const result = await this.searchProducts(model, {
      categoryId: 'pcmcat219400050004',
      pageSize: 5,
    })
    return result.products
  }

  /**
   * Search for Power Supplies
   */
  async searchPSU(model: string): Promise<BestBuyProduct[]> {
    // Category ID for Power Supplies: abcat0507007
    const result = await this.searchProducts(model, {
      categoryId: 'abcat0507007',
      pageSize: 5,
    })
    return result.products
  }

  /**
   * Build an affiliate URL for a product
   * Set BESTBUY_AFFILIATE_ID in .env.local to enable affiliate tracking
   * Sign up at: https://www.bestbuy.com/site/affiliate-program
   */
  buildAffiliateUrl(productUrl: string): string {
    const affiliateId = process.env.BESTBUY_AFFILIATE_ID
    if (!affiliateId) {
      return productUrl
    }
    // Best Buy uses Impact Radius for affiliate tracking
    // Format: https://bestbuy.7tiv.net/c/{affiliate_id}/614286/10014?u={encoded_product_url}
    const encodedUrl = encodeURIComponent(productUrl)
    return `https://bestbuy.7tiv.net/c/${affiliateId}/614286/10014?u=${encodedUrl}`
  }
}

/**
 * Singleton client instance
 */
let clientInstance: BestBuyClient | null = null

export function getBestBuyClient(): BestBuyClient {
  if (!clientInstance) {
    clientInstance = new BestBuyClient()
  }
  return clientInstance
}

/**
 * Format price from Best Buy product for database
 */
export function formatBestBuyPrice(product: BestBuyProduct) {
  return {
    retailer: 'Best Buy',
    price: product.salePrice || product.regularPrice,
    affiliateUrl: product.url,
    inStock: product.onlineAvailability || product.inStoreAvailability,
    sku: product.sku,
    onSale: product.onSale,
    regularPrice: product.regularPrice,
  }
}
