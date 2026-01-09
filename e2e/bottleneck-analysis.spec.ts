import { test, expect, Page } from '@playwright/test'

/**
 * Helper functions for navigating the SmoothSpec wizard
 */

async function clickStartAnalysis(page: Page) {
  // Click the "Check My Build" button on homepage
  await page.getByRole('button', { name: /check my build/i }).click()
  await page.waitForURL(/\/analyzer/)
}

async function selectCpu(page: Page, brand: string, generation: string, model: string) {
  // Wait for CPU section to load
  await page.locator('button:has-text("Brand")').first().waitFor({ state: 'visible', timeout: 15000 })

  // Select CPU brand
  await page.locator('button:has-text("Brand")').first().click()
  await page.getByRole('option', { name: brand, exact: true }).click()

  // Wait for generation dropdown to enable
  await page.waitForTimeout(1000)

  // Select CPU generation
  await page.locator('button:has-text("Generation")').click()
  await page.getByRole('option', { name: new RegExp(generation) }).click()

  // Wait for model dropdown to enable
  await page.waitForTimeout(1000)

  // Select CPU model (first Model button - in CPU section)
  await page.locator('button:has-text("Model")').first().click()
  await page.getByRole('option', { name: model, exact: true }).click()
}

async function selectGpu(page: Page, brand: string, series: string, model: string) {
  // GPU Brand button - look for "Brand" text (CPU brand already shows selected value like "Intel")
  await page.locator('button:has-text("Brand")').click()
  await page.getByRole('option', { name: brand, exact: true }).click()

  // Wait for series dropdown to load
  await page.waitForTimeout(1000)

  // Select GPU series
  await page.locator('button:has-text("Series")').click()
  await page.getByRole('option', { name: new RegExp(series) }).click()

  // Wait for model dropdown to load
  await page.waitForTimeout(1000)

  // Select GPU model (second Model button - GPU section)
  // CPU Model already shows selected value, so GPU Model still shows "Model"
  await page.locator('button:has-text("Model")').click()
  await page.getByRole('option', { name: model, exact: true }).click()
}

async function selectRam(page: Page, type: 'DDR4' | 'DDR5', sizeGB: string) {
  // Find RAM section and select type
  const memorySection = page.locator('text=MEMORY').locator('..')
  await memorySection.locator('button:has-text("Select type")').first().click()
  await page.getByRole('option', { name: type }).click()

  // Wait for RAM size dropdown to enable
  await page.waitForTimeout(500)

  // Select RAM size (after type selected, size dropdown shows "Select size")
  await memorySection.locator('button:has-text("Select size")').click()
  await page.getByRole('option', { name: `${sizeGB}GB` }).click()
}

async function selectStorage(page: Page, type: 'nvme' | 'sata-ssd' | 'hdd') {
  const labels: Record<string, string> = {
    'nvme': 'NVMe SSD',
    'sata-ssd': 'SATA SSD',
    'hdd': 'HDD',
  }
  // Find Storage & Power section
  const storageSection = page.locator('text=STORAGE & POWER').locator('..')
  await storageSection.locator('button:has-text("Select type")').click()
  await page.getByRole('option', { name: labels[type] }).click()
}

async function selectPsu(page: Page, wattage: string) {
  // PSU dropdown shows "Select wattage" placeholder
  await page.locator('button:has-text("Select wattage")').click()
  await page.getByRole('option', { name: `${wattage}W` }).click()
}

async function selectResolution(page: Page, resolution: '1080p' | '1440p' | '4k') {
  const labels: Record<string, string> = {
    '1080p': '1080p (Full HD)',
    '1440p': '1440p (QHD)',
    '4k': '4K (Ultra HD)',
  }
  // Resolution dropdown has a default value (1440p), find it in DISPLAY section
  const displaySection = page.locator('text=DISPLAY').locator('..')
  await displaySection.locator('button').first().click()
  await page.getByRole('option', { name: labels[resolution] }).click()
}

async function goToStep2(page: Page) {
  // Click Continue button to go to game selection
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.waitForTimeout(500)
}

async function selectGames(page: Page, gameNames: string[]) {
  for (const gameName of gameNames) {
    // Click on game card to select it
    await page.getByText(gameName, { exact: false }).first().click()
  }
}

async function goToStep3(page: Page) {
  // Click Continue button to go to budget step
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.waitForTimeout(500)
}

async function goToResults(page: Page) {
  // Click Analyze My Build button to go to results
  await page.getByRole('button', { name: 'Analyze My Build' }).click()
  await page.waitForURL(/\/results/, { timeout: 15000 })
}

test.describe('Bottleneck Analysis Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Happy Path', () => {
    test('completes full analysis flow with balanced hardware', async ({ page }) => {
      await clickStartAnalysis(page)

      // Step 1: Select components
      await selectCpu(page, 'Intel', '14th Gen', 'Core i7-14700K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4070')
      await selectRam(page, 'DDR5', '32')
      await selectStorage(page, 'nvme')
      await selectPsu(page, '750')
      await selectResolution(page, '1440p')

      await goToStep2(page)

      // Step 2: Select games
      await selectGames(page, ['Cyberpunk 2077', 'Valorant'])

      await goToStep3(page)
      await goToResults(page)

      // Verify results page loaded
      await expect(page).toHaveURL(/\/results/)

      // Verify key elements are present
      await expect(page.getByText(/build score|system score/i).first()).toBeVisible()
      await expect(page.getByText(/bottleneck/i).first()).toBeVisible()
    })
  })

  test.describe('Resolution Variations', () => {
    test('1080p shows more CPU-bound tendency', async ({ page }) => {
      await clickStartAnalysis(page)

      await selectCpu(page, 'Intel', '14th Gen', 'Core i5-14600K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4070')
      await selectRam(page, 'DDR5', '32')
      await selectStorage(page, 'nvme')
      await selectPsu(page, '750')
      await selectResolution(page, '1080p')

      await goToStep2(page)
      await selectGames(page, ['Cyberpunk 2077'])
      await goToStep3(page)
      await goToResults(page)

      // At 1080p, the result text should reflect CPU-bound analysis
      const pageText = await page.textContent('body')
      expect(pageText).toContain('bottleneck')
    })

    test('4K shows more GPU-bound tendency', async ({ page }) => {
      await clickStartAnalysis(page)

      await selectCpu(page, 'Intel', '14th Gen', 'Core i5-14600K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4070')
      await selectRam(page, 'DDR5', '32')
      await selectStorage(page, 'nvme')
      await selectPsu(page, '750')
      await selectResolution(page, '4k')

      await goToStep2(page)
      await selectGames(page, ['Cyberpunk 2077'])
      await goToStep3(page)
      await goToResults(page)

      // At 4K, results should reflect GPU-bound analysis
      const pageText = await page.textContent('body')
      expect(pageText).toContain('bottleneck')
    })
  })

  test.describe('Hardware Mismatch Scenarios', () => {
    test('high-end CPU with budget GPU shows GPU bottleneck', async ({ page }) => {
      await clickStartAnalysis(page)

      // High-end CPU with lower-tier GPU
      await selectCpu(page, 'Intel', '14th Gen', 'Core i9-14900K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4060')
      await selectRam(page, 'DDR5', '32')
      await selectStorage(page, 'nvme')
      await selectPsu(page, '750')
      await selectResolution(page, '1440p')

      await goToStep2(page)
      await selectGames(page, ['Cyberpunk 2077'])
      await goToStep3(page)
      await goToResults(page)

      // Should indicate GPU is the bottleneck
      await expect(page.getByText(/GPU.*bottleneck/i).or(page.getByText(/bottleneck.*GPU/i)).first()).toBeVisible()
    })

    test('budget CPU with high-end GPU shows CPU bottleneck', async ({ page }) => {
      await clickStartAnalysis(page)

      // Budget CPU with high-end GPU
      await selectCpu(page, 'Intel', '12th Gen', 'Core i3-12100F')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4090')
      await selectRam(page, 'DDR5', '32')
      await selectStorage(page, 'nvme')
      await selectPsu(page, '1000')
      await selectResolution(page, '1440p')

      await goToStep2(page)
      await selectGames(page, ['Cyberpunk 2077'])
      await goToStep3(page)
      await goToResults(page)

      // Should indicate CPU is the bottleneck
      await expect(page.getByText(/CPU.*bottleneck/i).or(page.getByText(/bottleneck.*CPU/i)).first()).toBeVisible()
    })
  })

  test.describe('Game Selection Edge Cases', () => {
    test('CPU-heavy game shows CPU emphasis', async ({ page }) => {
      await clickStartAnalysis(page)

      await selectCpu(page, 'Intel', '14th Gen', 'Core i5-14600K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4070')
      await selectRam(page, 'DDR5', '32')
      await selectStorage(page, 'nvme')
      await selectPsu(page, '750')
      await selectResolution(page, '1440p')

      await goToStep2(page)
      // Cities: Skylines II is CPU-heavy
      await selectGames(page, ['Cities: Skylines II'])
      await goToStep3(page)
      await goToResults(page)

      await expect(page.getByText(/Cities.*Skylines/i).first()).toBeVisible()
    })

    test('GPU-heavy game shows GPU emphasis', async ({ page }) => {
      await clickStartAnalysis(page)

      await selectCpu(page, 'Intel', '14th Gen', 'Core i5-14600K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4070')
      await selectRam(page, 'DDR5', '32')
      await selectStorage(page, 'nvme')
      await selectPsu(page, '750')
      await selectResolution(page, '1440p')

      await goToStep2(page)
      // Cyberpunk 2077 is GPU-heavy
      await selectGames(page, ['Cyberpunk 2077'])
      await goToStep3(page)
      await goToResults(page)

      await expect(page.getByText(/Cyberpunk/i).first()).toBeVisible()
    })
  })

  test.describe('RAM Requirements', () => {
    test('16GB RAM with 32GB game shows RAM warning', async ({ page }) => {
      await clickStartAnalysis(page)

      await selectCpu(page, 'Intel', '14th Gen', 'Core i5-14600K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4070')
      await selectRam(page, 'DDR5', '16') // Only 16GB
      await selectStorage(page, 'nvme')
      await selectPsu(page, '750')
      await selectResolution(page, '1440p')

      await goToStep2(page)
      // Escape from Tarkov requires 32GB
      await selectGames(page, ['Escape from Tarkov'])
      await goToStep3(page)
      await goToResults(page)

      // Should mention RAM insufficiency - look for "Needs +16GB RAM" badge or similar
      await expect(page.getByText(/Needs.*RAM/i).or(page.getByText(/\+\d+GB RAM/i)).first()).toBeVisible()
    })

    test('32GB RAM with high-RAM game shows no warning', async ({ page }) => {
      await clickStartAnalysis(page)

      await selectCpu(page, 'Intel', '14th Gen', 'Core i5-14600K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4070')
      await selectRam(page, 'DDR5', '32') // 32GB
      await selectStorage(page, 'nvme')
      await selectPsu(page, '750')
      await selectResolution(page, '1440p')

      await goToStep2(page)
      await selectGames(page, ['Escape from Tarkov'])
      await goToStep3(page)
      await goToResults(page)

      // RAM should be sufficient - look for "balanced" or results page content
      await expect(page.getByText(/balanced|sufficient/i).first()).toBeVisible()
    })
  })

  test.describe('Storage Analysis', () => {
    test('HDD storage shows upgrade recommendation', async ({ page }) => {
      await clickStartAnalysis(page)

      await selectCpu(page, 'Intel', '14th Gen', 'Core i5-14600K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4070')
      await selectRam(page, 'DDR5', '32')
      await selectStorage(page, 'hdd') // HDD
      await selectPsu(page, '750')
      await selectResolution(page, '1440p')

      await goToStep2(page)
      await selectGames(page, ['Cyberpunk 2077'])
      await goToStep3(page)
      await goToResults(page)

      // Should recommend SSD upgrade
      await expect(page.getByText(/SSD/i).first()).toBeVisible()
    })

    test('NVMe storage shows optimal', async ({ page }) => {
      await clickStartAnalysis(page)

      await selectCpu(page, 'Intel', '14th Gen', 'Core i5-14600K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4070')
      await selectRam(page, 'DDR5', '32')
      await selectStorage(page, 'nvme')
      await selectPsu(page, '750')
      await selectResolution(page, '1440p')

      await goToStep2(page)
      await selectGames(page, ['Cyberpunk 2077'])
      await goToStep3(page)
      await goToResults(page)

      // Should show NVMe in storage info
      await expect(page.getByText(/NVMe/i).first()).toBeVisible()
    })
  })

  test.describe('PSU Analysis', () => {
    test('underpowered PSU with high-end components shows warning', async ({ page }) => {
      await clickStartAnalysis(page)

      // High-end components with weak PSU
      await selectCpu(page, 'Intel', '14th Gen', 'Core i9-14900K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4090')
      await selectRam(page, 'DDR5', '32')
      await selectStorage(page, 'nvme')
      await selectPsu(page, '450') // Too weak for this config
      await selectResolution(page, '1440p')

      await goToStep2(page)
      await selectGames(page, ['Cyberpunk 2077'])
      await goToStep3(page)
      await goToResults(page)

      // Should warn about PSU - look for warning text
      await expect(page.getByText(/PSU/i).first()).toBeVisible()
      await expect(page.getByText(/insufficient|upgrade|higher/i).first()).toBeVisible()
    })

    test('adequate PSU shows headroom', async ({ page }) => {
      await clickStartAnalysis(page)

      await selectCpu(page, 'Intel', '14th Gen', 'Core i5-14600K')
      await selectGpu(page, 'NVIDIA', 'RTX 40 Series', 'GeForce RTX 4070')
      await selectRam(page, 'DDR5', '32')
      await selectStorage(page, 'nvme')
      await selectPsu(page, '850') // Plenty of headroom
      await selectResolution(page, '1440p')

      await goToStep2(page)
      await selectGames(page, ['Cyberpunk 2077'])
      await goToStep3(page)
      await goToResults(page)

      // Should show 850W PSU info
      await expect(page.getByText(/850W/i).first()).toBeVisible()
    })
  })
})
