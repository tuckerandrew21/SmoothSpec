import { z } from "zod";

/**
 * Zod schemas for validating seed data
 * Used to ensure data integrity before database insertion
 */

// CPU Specs Schema
export const CpuSpecsSchema = z.object({
  cores: z.number().int().min(2).max(128),
  threads: z.number().int().min(2).max(256),
  base_clock: z.number().positive(),
  boost_clock: z.number().positive(),
  tdp: z.number().int().positive(),
  socket: z.string().min(1),
  integrated_graphics: z.boolean(),
  // Optional fields for special CPUs
  gaming_optimized: z.boolean().optional(),
  cache_3d: z.number().int().positive().optional(),
});

// GPU Specs Schema
export const GpuSpecsSchema = z.object({
  vram: z.number().int().min(1).max(48),
  memory_type: z.enum(["GDDR5", "GDDR5X", "GDDR6", "GDDR6X", "HBM2", "HBM2e"]),
  tdp: z.number().int().positive(),
  architecture: z.string().min(1),
  ray_tracing: z.boolean(),
  // NVIDIA-specific
  dlss: z.number().int().min(1).max(4).optional(),
  // AMD-specific
  fsr: z.number().int().min(1).max(3).optional(),
});

// RAM Specs Schema (for future use)
export const RamSpecsSchema = z.object({
  capacity: z.number().int().min(1).max(256),
  speed: z.number().int().positive(),
  type: z.enum(["DDR3", "DDR4", "DDR5"]),
  modules: z.number().int().min(1).max(8),
  latency: z.string().optional(),
});

// Storage Specs Schema (for future use)
export const StorageSpecsSchema = z.object({
  capacity: z.number().int().positive(),
  type: z.enum(["HDD", "SATA SSD", "NVMe"]),
  read_speed: z.number().int().positive().optional(),
  write_speed: z.number().int().positive().optional(),
  interface: z.string().optional(),
});

// PSU Specs Schema (for future use)
export const PsuSpecsSchema = z.object({
  wattage: z.number().int().positive(),
  efficiency: z.enum(["80+", "80+ Bronze", "80+ Silver", "80+ Gold", "80+ Platinum", "80+ Titanium"]),
  modular: z.enum(["non-modular", "semi-modular", "fully-modular"]),
});

// Game Schema
export const GameSchema = z.object({
  name: z.string().min(1),
  steam_id: z.string(), // Can be empty string for non-Steam games
  cpu_weight: z.number().min(0.5).max(1.5),
  gpu_weight: z.number().min(0.5).max(1.5),
  ram_requirement: z.number().int().min(4).max(64),
  recommended_specs: z.object({
    min_cpu: z.string().optional(),
    rec_cpu: z.string().optional(),
    min_gpu: z.string().optional(),
    rec_gpu: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
});

// Component type discriminated union
export const ComponentSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("cpu"),
    brand: z.enum(["Intel", "AMD"]),
    model: z.string().min(1),
    release_year: z.number().int().min(2015).max(2025),
    benchmark_score: z.number().int().min(5000).max(60000),
    specs: CpuSpecsSchema,
  }),
  z.object({
    type: z.literal("gpu"),
    brand: z.enum(["NVIDIA", "AMD", "Intel"]),
    model: z.string().min(1),
    release_year: z.number().int().min(2015).max(2025),
    benchmark_score: z.number().int().min(3000).max(45000),
    specs: GpuSpecsSchema,
  }),
  z.object({
    type: z.literal("ram"),
    brand: z.string().min(1),
    model: z.string().min(1),
    release_year: z.number().int().min(2015).max(2025),
    benchmark_score: z.number().int().min(1000).max(10000),
    specs: RamSpecsSchema,
  }),
  z.object({
    type: z.literal("storage"),
    brand: z.string().min(1),
    model: z.string().min(1),
    release_year: z.number().int().min(2015).max(2025),
    benchmark_score: z.number().int().min(100).max(50000),
    specs: StorageSpecsSchema,
  }),
  z.object({
    type: z.literal("psu"),
    brand: z.string().min(1),
    model: z.string().min(1),
    release_year: z.number().int().min(2015).max(2025),
    benchmark_score: z.number().int().min(0).max(100),
    specs: PsuSpecsSchema,
  }),
]);

// Type exports
export type CpuSpecs = z.infer<typeof CpuSpecsSchema>;
export type GpuSpecs = z.infer<typeof GpuSpecsSchema>;
export type RamSpecs = z.infer<typeof RamSpecsSchema>;
export type StorageSpecs = z.infer<typeof StorageSpecsSchema>;
export type PsuSpecs = z.infer<typeof PsuSpecsSchema>;
export type GameData = z.infer<typeof GameSchema>;
export type ComponentData = z.infer<typeof ComponentSchema>;
