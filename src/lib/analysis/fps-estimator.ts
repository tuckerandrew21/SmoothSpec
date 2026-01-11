/**
 * FPS Loss Estimator - Convert bottleneck percentages to concrete FPS numbers
 */

import type { Game, GameAnalysis } from '@/types/analysis'
import type { Resolution } from '../resolution-modifier'

/**
 * Determine baseline FPS target for a game based on its characteristics
 * High CPU weight games = competitive (240 FPS target)
 * High GPU weight games = AAA (75 FPS target)
 * Balanced games = 90 FPS target
 */
function getBaselineFpsForGame(game: Game): number {
  // Competitive games (high CPU weight) - users expect high FPS
  if (game.cpu_weight > 1.2) {
    return 240
  }

  // AAA games (high GPU weight) - typically 60-90 FPS target
  if (game.gpu_weight > 1.3) {
    return 75
  }

  // Balanced games
  return 90
}

/**
 * Estimate FPS loss due to bottlenecks
 * Converts abstract bottleneck percentages into concrete FPS numbers
 */
export function estimateFpsLoss(
  game: Game,
  bottleneck: GameAnalysis['bottleneck'],
  cpuScore: number,
  gpuScore: number,
  resolution: Resolution
): { cpu: number; gpu: number; total: number } {
  const baselineFps = getBaselineFpsForGame(game)

  // Calculate expected FPS if no bottleneck (component at 100% efficiency)
  const cpuExpectedFps = baselineFps * (cpuScore / 100)
  const gpuExpectedFps = baselineFps * (gpuScore / 100)

  // Calculate actual FPS with bottleneck applied
  // Bottleneck percentage represents lost performance
  const cpuActualFps = cpuExpectedFps * (1 - bottleneck.percentage / 100)
  const gpuActualFps = gpuExpectedFps * (1 - bottleneck.percentage / 100)

  // FPS loss is the difference
  const cpuLoss = bottleneck.component === 'cpu' ? Math.max(0, cpuExpectedFps - cpuActualFps) : 0
  const gpuLoss = bottleneck.component === 'gpu' ? Math.max(0, gpuExpectedFps - gpuActualFps) : 0

  return {
    cpu: Math.round(cpuLoss),
    gpu: Math.round(gpuLoss),
    total: Math.round(cpuLoss + gpuLoss),
  }
}
