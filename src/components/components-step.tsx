"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorAlert } from "@/components/ui/error-alert"
import {
  useComponentBrands,
  useComponentFamilies,
  useComponentsByFamily,
  FAMILY_EXAMPLES,
} from "@/lib/hooks/use-components"
import type { BuildData } from "@/types/build"

interface ComponentsStepProps {
  buildData: BuildData
  updateBuildData: (data: Partial<BuildData>) => void
}

export function ComponentsStep({ buildData, updateBuildData }: ComponentsStepProps) {
  // CPU cascading state
  const [cpuBrand, setCpuBrand] = useState<string>("")
  const [cpuFamily, setCpuFamily] = useState<string>("")

  // GPU cascading state
  const [gpuBrand, setGpuBrand] = useState<string>("")
  const [gpuFamily, setGpuFamily] = useState<string>("")

  // RAM state
  const [ramType, setRamType] = useState<string>("")
  const [ramSize, setRamSize] = useState<string>("")

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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-card-foreground">Tell us about your PC</h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Enter your current hardware components</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* CPU Selection - Cascading Dropdowns */}
        <div className="space-y-3">
          <Label className="text-xs sm:text-sm text-card-foreground">CPU (Processor)</Label>
          {cpuBrandsError || cpusError ? (
            <ErrorAlert message="Failed to load CPUs" />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {/* Brand */}
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

              {/* Family */}
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

              {/* Model */}
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

        {/* GPU Selection - Cascading Dropdowns */}
        <div className="space-y-3">
          <Label className="text-xs sm:text-sm text-card-foreground">GPU (Graphics Card)</Label>
          {gpuBrandsError || gpusError ? (
            <ErrorAlert message="Failed to load GPUs" />
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {/* Brand */}
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

              {/* Series */}
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

              {/* Model */}
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

        {/* RAM Selection */}
        <div className="space-y-3">
          <Label className="text-xs sm:text-sm text-card-foreground">RAM (Memory)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={ramType} onValueChange={setRamType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ddr4">DDR4</SelectItem>
                <SelectItem value="ddr5">DDR5</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ramSize} onValueChange={setRamSize}>
              <SelectTrigger>
                <SelectValue placeholder="Size" />
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

        {/* Storage */}
        <div className="space-y-2">
          <Label htmlFor="storage" className="text-xs sm:text-sm text-card-foreground">Storage Type</Label>
          <Select value={buildData.storage} onValueChange={(value) => updateBuildData({ storage: value })}>
            <SelectTrigger id="storage"><SelectValue placeholder="Select storage type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="nvme">NVMe SSD</SelectItem>
              <SelectItem value="sata-ssd">SATA SSD</SelectItem>
              <SelectItem value="hdd">HDD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PSU */}
        <div className="space-y-2">
          <Label htmlFor="psu" className="text-xs sm:text-sm text-card-foreground">Power Supply (PSU Wattage)</Label>
          <Select value={buildData.psu} onValueChange={(value) => updateBuildData({ psu: value })}>
            <SelectTrigger id="psu"><SelectValue placeholder="Select PSU wattage" /></SelectTrigger>
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
  )
}
