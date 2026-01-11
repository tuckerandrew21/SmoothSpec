/**
 * Build Presets - Quick start configurations for common builds
 */

import type { Resolution } from './resolution-modifier'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface BuildPreset {
  name: string
  description: string
  targetResolution: Resolution
  components: {
    cpu: string // Model name for lookup
    gpu: string
    ram: string // Format: "ddr5-16"
    storage?: string
    psu?: string
  }
  estimatedCost: number
}

export const BUILD_PRESETS: BuildPreset[] = [
  {
    name: 'Budget Gaming (1080p)',
    description: 'Solid 60+ FPS in most games',
    targetResolution: '1080p',
    components: {
      cpu: 'Intel Core i5-12400F',
      gpu: 'NVIDIA GeForce RTX 4060',
      ram: 'ddr4-16',
      storage: 'sata-ssd',
      psu: '550',
    },
    estimatedCost: 500,
  },
  {
    name: 'Mid-Range (1440p)',
    description: 'High settings, 100+ FPS',
    targetResolution: '1440p',
    components: {
      cpu: 'AMD Ryzen 5 7600X',
      gpu: 'NVIDIA GeForce RTX 4070',
      ram: 'ddr5-32',
      storage: 'nvme',
      psu: '750',
    },
    estimatedCost: 950,
  },
  {
    name: 'High-End (4K)',
    description: 'Ultra settings, 4K gaming',
    targetResolution: '4k',
    components: {
      cpu: 'AMD Ryzen 7 7800X3D',
      gpu: 'NVIDIA GeForce RTX 4080',
      ram: 'ddr5-32',
      storage: 'nvme',
      psu: '850',
    },
    estimatedCost: 1670,
  },
]

/**
 * Find component ID by model name using fuzzy search
 * Returns the best match or null if not found
 */
export async function findComponentByName(
  modelName: string,
  type: 'cpu' | 'gpu',
  supabase: SupabaseClient
): Promise<string | null> {
  const { data, error } = await supabase
    .from(type === 'cpu' ? 'cpus' : 'gpus')
    .select('id, model')
    .ilike('model', `%${modelName}%`)
    .limit(1)

  if (error || !data || data.length === 0) {
    return null
  }

  return data[0].id
}
