/**
 * PCPartPicker Price Lookup Tests
 *
 * These tests verify that price lookups return realistic values.
 * They require a valid Supabase connection with the pcpartpicker_prices table.
 *
 * IMPORTANT: Price ranges are based on actual PCPartPicker database values.
 * Budget components (DDR5-4800 RAM, entry-level SSDs) can be very cheap.
 */

import { describe, it, expect } from 'vitest'
import {
  getRAMPrice,
  getCPUPrice,
  getGPUPrice,
  getStoragePrice,
  getPSUPrice,
  getComponentPrice,
} from '../pcpartpicker-prices'

describe('PCPartPicker Price Lookups', () => {
  describe('RAM prices', () => {
    it('returns realistic price for DDR5 32GB kit with dual-channel config', async () => {
      const result = await getRAMPrice(5, 32)

      console.log('DDR5 32GB result:', result)

      // Should return a price and product name
      expect(result.price).not.toBeNull()
      expect(result.productName).toBeTruthy()

      // Price range: Budget DDR5-4800 kits start ~$60, high-end DDR5-8000 ~$400
      expect(result.price).toBeGreaterThan(50)
      expect(result.price).toBeLessThan(500)

      // CRITICAL: Should be a dual-channel kit (2x16GB for 32GB)
      // This was the main bug - single sticks were being returned
      expect(result.chipset).toBeTruthy()
      expect(result.chipset).toMatch(/2x\d+GB/)
    })

    it('returns realistic price for DDR5 16GB kit', async () => {
      const result = await getRAMPrice(5, 16)

      console.log('DDR5 16GB result:', result)

      expect(result.price).not.toBeNull()
      // Budget DDR5-4800 16GB (2x8GB) can be ~$35-40
      expect(result.price).toBeGreaterThan(30)
      expect(result.price).toBeLessThan(300)
    })

    it('returns realistic price for DDR4 32GB kit', async () => {
      const result = await getRAMPrice(4, 32)

      console.log('DDR4 32GB result:', result)

      // DDR4 is mature, prices are low
      if (result.price) {
        expect(result.price).toBeGreaterThan(40)
        expect(result.price).toBeLessThan(300)
      }
    })
  })

  describe('CPU prices', () => {
    it('returns realistic price for Intel Core i7-14700K', async () => {
      const result = await getCPUPrice('Intel Core i7-14700K')

      console.log('i7-14700K result:', result)

      expect(result.price).not.toBeNull()
      expect(result.price).toBeGreaterThan(200)
      expect(result.price).toBeLessThan(600)
    })

    it('returns realistic price for AMD Ryzen 7 7800X3D', async () => {
      const result = await getCPUPrice('AMD Ryzen 7 7800X3D')

      console.log('7800X3D result:', result)

      expect(result.price).not.toBeNull()
      expect(result.price).toBeGreaterThan(200)
      expect(result.price).toBeLessThan(600)
    })

    it('returns realistic price for budget CPU (Ryzen 5 5600)', async () => {
      const result = await getCPUPrice('Ryzen 5 5600')

      console.log('Ryzen 5 5600 result:', result)

      if (result.price) {
        expect(result.price).toBeGreaterThan(80)
        expect(result.price).toBeLessThan(250)
      }
    })
  })

  describe('GPU prices', () => {
    it('returns realistic price for RTX 4070', async () => {
      const result = await getGPUPrice('RTX 4070')

      console.log('RTX 4070 result:', result)

      expect(result.price).not.toBeNull()
      expect(result.price).toBeGreaterThan(400)
      expect(result.price).toBeLessThan(800)
    })

    it('returns realistic price for RX 7800 XT', async () => {
      const result = await getGPUPrice('Radeon RX 7800 XT')

      console.log('RX 7800 XT result:', result)

      expect(result.price).not.toBeNull()
      expect(result.price).toBeGreaterThan(350)
      expect(result.price).toBeLessThan(800)
    })

    it('returns realistic price for RTX 4090 (high-end)', async () => {
      const result = await getGPUPrice('RTX 4090')

      console.log('RTX 4090 result:', result)

      if (result.price) {
        expect(result.price).toBeGreaterThan(1500)
        expect(result.price).toBeLessThan(3500) // RTX 4090 prices vary widely
      }
    })
  })

  describe('Storage prices', () => {
    it('returns realistic price for 1TB NVMe SSD', async () => {
      const result = await getStoragePrice('ssd', 1000, true)

      console.log('1TB NVMe result:', result)

      expect(result.price).not.toBeNull()
      // Budget NVMe SSDs can be very cheap ($40-50)
      expect(result.price).toBeGreaterThan(30)
      expect(result.price).toBeLessThan(200)
    })

    it('returns realistic price for 2TB NVMe SSD', async () => {
      const result = await getStoragePrice('ssd', 2000, true)

      console.log('2TB NVMe result:', result)

      if (result.price) {
        expect(result.price).toBeGreaterThan(60)
        expect(result.price).toBeLessThan(400)
      }
    })
  })

  describe('PSU prices', () => {
    it('returns realistic price for 750W PSU', async () => {
      const result = await getPSUPrice(750)

      console.log('750W PSU result:', result)

      expect(result.price).not.toBeNull()
      expect(result.price).toBeGreaterThan(40)
      expect(result.price).toBeLessThan(200)
    })

    it('returns realistic price for 850W 80+ Gold PSU', async () => {
      const result = await getPSUPrice(850, '80+ Gold')

      console.log('850W Gold result:', result)

      if (result.price) {
        // Good 850W Gold PSUs can start around $65-70 on sale
        expect(result.price).toBeGreaterThan(50)
        expect(result.price).toBeLessThan(300)
      }
    })
  })

  describe('getComponentPrice() generic function', () => {
    it('routes RAM queries correctly', async () => {
      const result = await getComponentPrice('ram', 'DDR5 32GB Kit')

      console.log('getComponentPrice RAM result:', result)

      // Should parse and route to getRAMPrice
      expect(result.source).toBe('pcpartpicker')
    })

    it('routes storage queries correctly', async () => {
      const result = await getComponentPrice('storage', '1TB NVMe SSD')

      console.log('getComponentPrice storage result:', result)

      expect(result.source).toBe('pcpartpicker')
    })

    it('routes PSU queries correctly', async () => {
      const result = await getComponentPrice('psu', '750W 80+ Gold')

      console.log('getComponentPrice PSU result:', result)

      expect(result.source).toBe('pcpartpicker')
    })
  })
})
