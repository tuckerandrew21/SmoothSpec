"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorAlert } from "@/components/ui/error-alert"
import { useComponents, formatComponentName } from "@/lib/hooks/use-components"
import type { BuildData } from "@/types/build"

interface ComponentsStepProps {
  buildData: BuildData
  updateBuildData: (data: Partial<BuildData>) => void
}

export function ComponentsStep({ buildData, updateBuildData }: ComponentsStepProps) {
  const { components: cpus, loading: cpusLoading, error: cpusError, retry: retryCpus } = useComponents("cpu")
  const { components: gpus, loading: gpusLoading, error: gpusError, retry: retryGpus } = useComponents("gpu")

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-card-foreground">Tell us about your PC</h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Enter your current hardware components</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* CPU Selection */}
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="cpu" className="text-xs sm:text-sm text-card-foreground">CPU (Processor)</Label>
            {cpusLoading ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : cpusError ? (
              <ErrorAlert message="Failed to load CPUs" onRetry={retryCpus} />
            ) : (
              <Select value={buildData.cpu} onValueChange={(value) => updateBuildData({ cpu: value })}>
                <SelectTrigger id="cpu">
                  <SelectValue placeholder="Select your CPU" />
                </SelectTrigger>
                <SelectContent>
                  {cpus.map((cpu) => (
                    <SelectItem key={cpu.id} value={cpu.id}>{formatComponentName(cpu)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpuPurchaseDate" className="text-xs sm:text-sm text-card-foreground">Purchase Date (optional)</Label>
            <Input id="cpuPurchaseDate" type="date" value={buildData.cpuPurchaseDate || ""} onChange={(e) => updateBuildData({ cpuPurchaseDate: e.target.value })} />
          </div>
        </div>

        {/* GPU Selection */}
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="gpu" className="text-xs sm:text-sm text-card-foreground">GPU (Graphics Card)</Label>
            {gpusLoading ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : gpusError ? (
              <ErrorAlert message="Failed to load GPUs" onRetry={retryGpus} />
            ) : (
              <Select value={buildData.gpu} onValueChange={(value) => updateBuildData({ gpu: value })}>
                <SelectTrigger id="gpu">
                  <SelectValue placeholder="Select your GPU" />
                </SelectTrigger>
                <SelectContent>
                  {gpus.map((gpu) => (
                    <SelectItem key={gpu.id} value={gpu.id}>{formatComponentName(gpu)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gpuPurchaseDate" className="text-xs sm:text-sm text-card-foreground">Purchase Date (optional)</Label>
            <Input id="gpuPurchaseDate" type="date" value={buildData.gpuPurchaseDate || ""} onChange={(e) => updateBuildData({ gpuPurchaseDate: e.target.value })} />
          </div>
        </div>

        {/* RAM Selection */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ram" className="text-xs sm:text-sm text-card-foreground">RAM (Memory)</Label>
            <Select value={buildData.ram} onValueChange={(value) => updateBuildData({ ram: value })}>
              <SelectTrigger id="ram"><SelectValue placeholder="Select RAM amount" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8GB</SelectItem>
                <SelectItem value="16">16GB</SelectItem>
                <SelectItem value="32">32GB</SelectItem>
                <SelectItem value="64">64GB</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ramPurchaseDate" className="text-xs sm:text-sm text-card-foreground">Purchase Date (optional)</Label>
            <Input id="ramPurchaseDate" type="date" value={buildData.ramPurchaseDate || ""} onChange={(e) => updateBuildData({ ramPurchaseDate: e.target.value })} />
          </div>
        </div>

        {/* Storage */}
        <div className="grid gap-4 sm:grid-cols-2">
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
          <div className="space-y-2">
            <Label htmlFor="storagePurchaseDate" className="text-xs sm:text-sm text-card-foreground">Purchase Date (optional)</Label>
            <Input id="storagePurchaseDate" type="date" value={buildData.storagePurchaseDate || ""} onChange={(e) => updateBuildData({ storagePurchaseDate: e.target.value })} />
          </div>
        </div>

        {/* PSU */}
        <div className="grid gap-4 sm:grid-cols-2">
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
          <div className="space-y-2">
            <Label htmlFor="psuPurchaseDate" className="text-xs sm:text-sm text-card-foreground">Purchase Date (optional)</Label>
            <Input id="psuPurchaseDate" type="date" value={buildData.psuPurchaseDate || ""} onChange={(e) => updateBuildData({ psuPurchaseDate: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  )
}
