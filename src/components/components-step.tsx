"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BuildData } from "@/types/build"

interface ComponentsStepProps {
  buildData: BuildData
  updateBuildData: (data: Partial<BuildData>) => void
}

const cpuOptions = [
  "Intel Core i9-14900K",
  "Intel Core i7-14700K",
  "Intel Core i5-14600K",
  "AMD Ryzen 9 7950X",
  "AMD Ryzen 7 7800X3D",
  "AMD Ryzen 5 7600X",
  "Intel Core i9-13900K",
  "Intel Core i7-13700K",
  "AMD Ryzen 9 5950X",
  "AMD Ryzen 7 5800X3D",
]

const gpuOptions = [
  "NVIDIA RTX 4090",
  "NVIDIA RTX 4080",
  "NVIDIA RTX 4070 Ti",
  "NVIDIA RTX 4070",
  "NVIDIA RTX 4060 Ti",
  "NVIDIA RTX 4060",
  "AMD RX 7900 XTX",
  "AMD RX 7900 XT",
  "AMD RX 7800 XT",
  "NVIDIA RTX 3080",
  "NVIDIA RTX 3070",
  "AMD RX 6800 XT",
]

export function ComponentsStep({ buildData, updateBuildData }: ComponentsStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-card-foreground sm:text-3xl">Tell us about your PC</h2>
        <p className="mt-2 text-muted-foreground">Enter your current hardware components</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cpu" className="text-card-foreground">
            CPU (Processor)
          </Label>
          <Select value={buildData.cpu} onValueChange={(value) => updateBuildData({ cpu: value })}>
            <SelectTrigger id="cpu">
              <SelectValue placeholder="Select your CPU" />
            </SelectTrigger>
            <SelectContent>
              {cpuOptions.map((cpu) => (
                <SelectItem key={cpu} value={cpu}>
                  {cpu}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gpu" className="text-card-foreground">
            GPU (Graphics Card)
          </Label>
          <Select value={buildData.gpu} onValueChange={(value) => updateBuildData({ gpu: value })}>
            <SelectTrigger id="gpu">
              <SelectValue placeholder="Select your GPU" />
            </SelectTrigger>
            <SelectContent>
              {gpuOptions.map((gpu) => (
                <SelectItem key={gpu} value={gpu}>
                  {gpu}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ram" className="text-card-foreground">
            RAM (Memory)
          </Label>
          <Select value={buildData.ram} onValueChange={(value) => updateBuildData({ ram: value })}>
            <SelectTrigger id="ram">
              <SelectValue placeholder="Select RAM amount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8GB">8GB</SelectItem>
              <SelectItem value="16GB">16GB</SelectItem>
              <SelectItem value="32GB">32GB</SelectItem>
              <SelectItem value="64GB">64GB</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="storage" className="text-card-foreground">
            Storage
          </Label>
          <Input
            id="storage"
            placeholder="e.g., 1TB NVMe SSD"
            value={buildData.storage}
            onChange={(e) => updateBuildData({ storage: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="psu" className="text-card-foreground">
            Power Supply (PSU Wattage)
          </Label>
          <Select value={buildData.psu} onValueChange={(value) => updateBuildData({ psu: value })}>
            <SelectTrigger id="psu">
              <SelectValue placeholder="Select PSU wattage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="450W">450W</SelectItem>
              <SelectItem value="550W">550W</SelectItem>
              <SelectItem value="650W">650W</SelectItem>
              <SelectItem value="750W">750W</SelectItem>
              <SelectItem value="850W">850W</SelectItem>
              <SelectItem value="1000W">1000W</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
