"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
  useComponentBrands,
  useComponentFamilies,
  useComponentsByFamily,
  FAMILY_EXAMPLES,
} from "@/lib/hooks/use-components"
import { BUILD_PRESETS, findComponentByName, type BuildPreset } from "@/lib/presets"
import type { BuildData } from "@/types/build"
import type { Resolution } from "@/lib/resolution-modifier"

interface ComponentsStepProps {
  buildData: BuildData
  updateBuildData: (data: Partial<BuildData>) => void
}

export function ComponentsStep({ buildData, updateBuildData }: ComponentsStepProps) {
  // Preset state
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [applyingPreset, setApplyingPreset] = useState(false)

  // CPU cascading state
  const [cpuBrand, setCpuBrand] = useState<string>("")
  const [cpuFamily, setCpuFamily] = useState<string>("")

  // GPU cascading state
  const [gpuBrand, setGpuBrand] = useState<string>("")
  const [gpuFamily, setGpuFamily] = useState<string>("")

  // RAM state
  const [ramType, setRamType] = useState<string>("")
  const [ramSize, setRamSize] = useState<string>("")

  // Apply preset function
  const applyPreset = async (preset: BuildPreset) => {
    setApplyingPreset(true)
    try {
      // Lookup component IDs
      const cpuId = await findComponentByName(preset.components.cpu, 'cpu', supabase)
      const gpuId = await findComponentByName(preset.components.gpu, 'gpu', supabase)

      if (cpuId && gpuId) {
        updateBuildData({
          cpu: cpuId,
          gpu: gpuId,
          ram: preset.components.ram,
          storage: preset.components.storage || buildData.storage,
          psu: preset.components.psu || buildData.psu,
          resolution: preset.targetResolution,
        })
        setSelectedPreset(preset.name)

        // Reset cascading dropdowns since we're setting IDs directly
        setCpuBrand("")
        setCpuFamily("")
        setGpuBrand("")
        setGpuFamily("")

        // Set RAM state
        const [type, size] = preset.components.ram.split('-')
        setRamType(type)
        setRamSize(size)
      }
    } catch (error) {
      console.error('Failed to apply preset:', error)
    } finally {
      setApplyingPreset(false)
    }
  }

  // Fetch data for cascading dropdowns
  const { brands: cpuBrands, loading: cpuBrandsLoading, error: cpuBrandsError } = useComponentBrands("cpu")
  const { families: cpuFamilies, loading: cpuFamiliesLoading } = useComponentFamilies("cpu", cpuBrand || null)
  const { components: cpus, loading: cpusLoading, error: cpusError } = useComponentsByFamily("cpu", cpuBrand || null, cpuFamily || null)

  const { brands: gpuBrands, loading: gpuBrandsLoading, error: gpuBrandsError } = useComponentBrands("gpu")
  const { families: gpuFamilies, loading: gpuFamiliesLoading } = useComponentFamilies("gpu", gpuBrand || null)
  const { components: gpus, loading: gpusLoading, error: gpusError } = useComponentsByFamily("gpu", gpuBrand || null, gpuFamily || null)

  // Reset downstream selections when parent changes
  useEffect(() => {
    setCpuFamily("")
    updateBuildData({ cpu: "" })
  }, [cpuBrand])

  useEffect(() => {
    updateBuildData({ cpu: "" })
  }, [cpuFamily])

  useEffect(() => {
    setGpuFamily("")
    updateBuildData({ gpu: "" })
  }, [gpuBrand])

  useEffect(() => {
    updateBuildData({ gpu: "" })
  }, [gpuFamily])

  // Combine RAM type and size into single value
  useEffect(() => {
    if (ramType && ramSize) {
      updateBuildData({ ram: `${ramType}-${ramSize}` })
    } else {
      updateBuildData({ ram: "" })
    }
  }, [ramType, ramSize])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-card-foreground">Tell us about your PC</h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Enter your current hardware components</p>
      </div>

      {/* Quick Start Presets */}
      <Card className="bg-blue-500/5 border-blue-500/20 p-4">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          🚀 Quick Start: Choose a preset build
        </h3>
        <div className="grid gap-2">
          {BUILD_PRESETS.map((preset) => (
            <Button
              key={preset.name}
              variant={selectedPreset === preset.name ? 'default' : 'outline'}
              onClick={() => applyPreset(preset)}
              disabled={applyingPreset}
              className="justify-start text-left h-auto py-3"
            >
              <div className="flex flex-col items-start w-full">
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs opacity-70">{preset.description}</div>
                <div className="text-xs opacity-50 mt-1">~${preset.estimatedCost}</div>
              </div>
            </Button>
          ))}
        </div>
        {selectedPreset && (
          <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
            <Check className="h-3 w-3" />
            Preset applied. Modify components below if needed.
          </div>
        )}
      </Card>

      {/* Core Components Section */}
      <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-5">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Core Components
        </h3>

        {/* CPU Selection */}
        <div className="space-y-2">
          <Label className="text-sm text-card-foreground font-medium">CPU (Processor)</Label>
          {cpuBrandsError || cpusError ? (
            <ErrorAlert message="Failed to load CPUs" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {cpuBrandsLoading ? (
                <Skeleton className="h-10 w-full rounded-md" />
              ) : (
                <Select value={cpuBrand} onValueChange={setCpuBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {cpuBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {cpuFamiliesLoading ? (
                <Skeleton className="h-10 w-full rounded-md" />
              ) : (
                <Select value={cpuFamily} onValueChange={setCpuFamily} disabled={!cpuBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Generation" />
                  </SelectTrigger>
                  <SelectContent>
                    {cpuFamilies.map((family) => (
                      <SelectItem key={family} value={family}>
                        <div className="flex flex-col">
                          <span>{family}</span>
                          {FAMILY_EXAMPLES[family] && (
                            <span className="text-xs text-muted-foreground">{FAMILY_EXAMPLES[family]}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {cpusLoading ? (
                <Skeleton className="h-10 w-full rounded-md" />
              ) : (
                <Select
                  value={buildData.cpu}
                  onValueChange={(value) => updateBuildData({ cpu: value })}
                  disabled={!cpuFamily}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {cpus.map((cpu) => (
                      <SelectItem key={cpu.id} value={cpu.id}>{cpu.model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>

        {/* GPU Selection */}
        <div className="space-y-2">
          <Label className="text-sm text-card-foreground font-medium">GPU (Graphics Card)</Label>
          {gpuBrandsError || gpusError ? (
            <ErrorAlert message="Failed to load GPUs" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {gpuBrandsLoading ? (
                <Skeleton className="h-10 w-full rounded-md" />
              ) : (
                <Select value={gpuBrand} onValueChange={setGpuBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {gpuBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {gpuFamiliesLoading ? (
                <Skeleton className="h-10 w-full rounded-md" />
              ) : (
                <Select value={gpuFamily} onValueChange={setGpuFamily} disabled={!gpuBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Series" />
                  </SelectTrigger>
                  <SelectContent>
                    {gpuFamilies.map((family) => (
                      <SelectItem key={family} value={family}>
                        <div className="flex flex-col">
                          <span>{family}</span>
                          {FAMILY_EXAMPLES[family] && (
                            <span className="text-xs text-muted-foreground">{FAMILY_EXAMPLES[family]}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {gpusLoading ? (
                <Skeleton className="h-10 w-full rounded-md" />
              ) : (
                <Select
                  value={buildData.gpu}
                  onValueChange={(value) => updateBuildData({ gpu: value })}
                  disabled={!gpuFamily}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {gpus.map((gpu) => (
                      <SelectItem key={gpu.id} value={gpu.id}>{gpu.model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Components - Two Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Memory Section */}
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Memory
          </h3>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm text-card-foreground">RAM Type</Label>
              <Select value={ramType} onValueChange={setRamType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ddr4">DDR4</SelectItem>
                  <SelectItem value="ddr5">DDR5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-card-foreground">RAM Size</Label>
              <Select value={ramSize} onValueChange={setRamSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8GB</SelectItem>
                  <SelectItem value="16">16GB</SelectItem>
                  <SelectItem value="32">32GB</SelectItem>
                  <SelectItem value="64">64GB</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Storage & Power Section */}
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Storage & Power
          </h3>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="storage" className="text-sm text-card-foreground">Storage Type</Label>
              <Select value={buildData.storage} onValueChange={(value) => updateBuildData({ storage: value })}>
                <SelectTrigger id="storage">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nvme">NVMe SSD</SelectItem>
                  <SelectItem value="sata-ssd">SATA SSD</SelectItem>
                  <SelectItem value="hdd">HDD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="psu" className="text-sm text-card-foreground">PSU Wattage</Label>
              <Select value={buildData.psu} onValueChange={(value) => updateBuildData({ psu: value })}>
                <SelectTrigger id="psu">
                  <SelectValue placeholder="Select wattage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="450">450W</SelectItem>
                  <SelectItem value="550">550W</SelectItem>
                  <SelectItem value="650">650W</SelectItem>
                  <SelectItem value="750">750W</SelectItem>
                  <SelectItem value="850">850W</SelectItem>
                  <SelectItem value="1000">1000W</SelectItem>
                  <SelectItem value="1200">1200W</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Display Section */}
      <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Display
        </h3>

        <div className="space-y-2">
          <Label htmlFor="resolution" className="text-sm text-card-foreground">Gaming Resolution</Label>
          <Select
            value={buildData.resolution}
            onValueChange={(value: Resolution) => updateBuildData({ resolution: value })}
          >
            <SelectTrigger id="resolution" className="w-full sm:w-48">
              <SelectValue placeholder="Select resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1080p">1080p (Full HD)</SelectItem>
              <SelectItem value="1440p">1440p (QHD)</SelectItem>
              <SelectItem value="4k">4K (Ultra HD)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Higher resolutions shift bottlenecks toward GPU, lower resolutions toward CPU.
          </p>
        </div>
      </div>
    </div>
  )
}
