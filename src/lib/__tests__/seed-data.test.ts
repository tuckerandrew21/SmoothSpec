import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import {
  parseComponentsSql,
  parseGamesSql,
  findDuplicateComponents,
  findDuplicateGames,
  ParsedComponent,
  ParsedGame,
} from "./utils/sql-parser";
import {
  CpuSpecsSchema,
  GpuSpecsSchema,
  GameSchema,
} from "../schemas/component-schemas";

// Read seed files
const seedDir = join(process.cwd(), "supabase", "seed");
const cpusSql = readFileSync(join(seedDir, "cpus.sql"), "utf-8");
const gpusSql = readFileSync(join(seedDir, "gpus.sql"), "utf-8");
const gamesSql = readFileSync(join(seedDir, "games.sql"), "utf-8");

// Parse data
let cpus: ParsedComponent[];
let gpus: ParsedComponent[];
let games: ParsedGame[];

beforeAll(() => {
  cpus = parseComponentsSql(cpusSql);
  gpus = parseComponentsSql(gpusSql);
  games = parseGamesSql(gamesSql);
});

describe("CPU Seed Data", () => {
  it("should parse all CPUs from SQL", () => {
    expect(cpus.length).toBeGreaterThan(0);
    console.log(`Parsed ${cpus.length} CPUs`);
  });

  it("should have no duplicate CPUs", () => {
    const duplicates = findDuplicateComponents(cpus);
    expect(duplicates).toEqual([]);
  });

  it("should have all CPUs with valid specs schema", () => {
    for (const cpu of cpus) {
      const result = CpuSpecsSchema.safeParse(cpu.specs);
      if (!result.success) {
        console.error(`Invalid CPU specs for ${cpu.brand} ${cpu.model}:`, result.error.format());
      }
      expect(result.success, `${cpu.brand} ${cpu.model} specs should be valid`).toBe(true);
    }
  });

  it("should have all CPUs with benchmark scores in valid range (2,000-60,000)", () => {
    for (const cpu of cpus) {
      expect(cpu.benchmark_score).toBeGreaterThanOrEqual(2000); // Lower for legacy FX series
      expect(cpu.benchmark_score).toBeLessThanOrEqual(60000);
    }
  });

  it("should have all CPUs with release_year between 2010-2026", () => {
    for (const cpu of cpus) {
      expect(cpu.release_year).toBeGreaterThanOrEqual(2010); // Extended for legacy hardware
      expect(cpu.release_year).toBeLessThanOrEqual(2026); // Extended for latest releases
    }
  });

  it("should have only Intel or AMD brands", () => {
    for (const cpu of cpus) {
      expect(["Intel", "AMD"]).toContain(cpu.brand);
    }
  });

  it("should not include laptop/mobile CPUs", () => {
    const laptopSuffixes = ["M", "H", "HX", "HK", "U", "Y", "Mobile"];
    for (const cpu of cpus) {
      const hasLaptopSuffix = laptopSuffixes.some(suffix =>
        cpu.model.includes(suffix)
      );
      expect(hasLaptopSuffix, `${cpu.brand} ${cpu.model} appears to be a laptop CPU`).toBe(false);
    }
  });
});

describe("GPU Seed Data", () => {
  it("should parse all GPUs from SQL", () => {
    expect(gpus.length).toBeGreaterThan(0);
    console.log(`Parsed ${gpus.length} GPUs`);
  });

  it("should have no duplicate GPUs", () => {
    const duplicates = findDuplicateComponents(gpus);
    expect(duplicates).toEqual([]);
  });

  it("should have all GPUs with valid specs schema", () => {
    for (const gpu of gpus) {
      const result = GpuSpecsSchema.safeParse(gpu.specs);
      if (!result.success) {
        console.error(`Invalid GPU specs for ${gpu.brand} ${gpu.model}:`, result.error.format());
      }
      expect(result.success, `${gpu.brand} ${gpu.model} specs should be valid`).toBe(true);
    }
  });

  it("should have all GPUs with benchmark scores in valid range (1,500-45,000)", () => {
    for (const gpu of gpus) {
      expect(gpu.benchmark_score).toBeGreaterThanOrEqual(1500); // Lower for old GPUs
      expect(gpu.benchmark_score).toBeLessThanOrEqual(45000); // Higher for RTX 5090
    }
  });

  it("should have all GPUs with release_year between 2010-2026", () => {
    for (const gpu of gpus) {
      expect(gpu.release_year).toBeGreaterThanOrEqual(2010); // Extended for legacy hardware
      expect(gpu.release_year).toBeLessThanOrEqual(2026); // Extended for latest releases
    }
  });

  it("should have only NVIDIA, AMD, or Intel brands", () => {
    for (const gpu of gpus) {
      expect(["NVIDIA", "AMD", "Intel"]).toContain(gpu.brand);
    }
  });

  it("should not include laptop/mobile GPUs", () => {
    const laptopSuffixes = ["M", "Mobile", "Laptop GPU", "Max-Q"];
    for (const gpu of gpus) {
      const hasLaptopSuffix = laptopSuffixes.some(suffix =>
        gpu.model.includes(suffix)
      );
      expect(hasLaptopSuffix, `${gpu.brand} ${gpu.model} appears to be a laptop GPU`).toBe(false);
    }
  });
});

describe("Game Seed Data", () => {
  it("should parse all games from SQL", () => {
    expect(games.length).toBeGreaterThan(0);
    console.log(`Parsed ${games.length} games`);
  });

  it("should have no duplicate games", () => {
    const duplicates = findDuplicateGames(games);
    expect(duplicates).toEqual([]);
  });

  it("should have all games with valid schema", () => {
    for (const game of games) {
      const result = GameSchema.safeParse(game);
      if (!result.success) {
        console.error(`Invalid game schema for ${game.name}:`, result.error.format());
      }
      expect(result.success, `${game.name} should have valid schema`).toBe(true);
    }
  });

  it("should have all games with cpu_weight in valid range (0.5-1.5)", () => {
    for (const game of games) {
      expect(game.cpu_weight).toBeGreaterThanOrEqual(0.5);
      expect(game.cpu_weight).toBeLessThanOrEqual(1.5);
    }
  });

  it("should have all games with gpu_weight in valid range (0.5-1.5)", () => {
    for (const game of games) {
      expect(game.gpu_weight).toBeGreaterThanOrEqual(0.5);
      expect(game.gpu_weight).toBeLessThanOrEqual(1.5);
    }
  });

  it("should have all games with ram_requirement in valid range (4-64)", () => {
    for (const game of games) {
      expect(game.ram_requirement).toBeGreaterThanOrEqual(4);
      expect(game.ram_requirement).toBeLessThanOrEqual(64);
    }
  });
});

describe("Data Coverage", () => {
  it("should have at least 100 CPUs", () => {
    expect(cpus.length).toBeGreaterThanOrEqual(100); // Increased for 2010-2026 coverage
  });

  it("should have at least 150 GPUs", () => {
    expect(gpus.length).toBeGreaterThanOrEqual(150); // Increased for 2010-2026 coverage
  });

  it("should have at least 50 games", () => {
    expect(games.length).toBeGreaterThanOrEqual(50);
  });

  it("should have CPUs from both Intel and AMD", () => {
    const brands = new Set(cpus.map((c) => c.brand));
    expect(brands.has("Intel")).toBe(true);
    expect(brands.has("AMD")).toBe(true);
  });

  it("should have GPUs from both NVIDIA and AMD", () => {
    const brands = new Set(gpus.map((g) => g.brand));
    expect(brands.has("NVIDIA")).toBe(true);
    expect(brands.has("AMD")).toBe(true);
  });
});
