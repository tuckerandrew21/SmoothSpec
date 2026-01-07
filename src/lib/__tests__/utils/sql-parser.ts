/**
 * SQL Parser Utility
 * Parses SQL INSERT statements from seed files for validation testing
 */

export interface ParsedComponent {
  type: string;
  brand: string;
  model: string;
  release_year: number;
  benchmark_score: number;
  specs: Record<string, unknown>;
}

export interface ParsedGame {
  name: string;
  steam_id: string;
  cpu_weight: number;
  gpu_weight: number;
  ram_requirement: number;
  recommended_specs?: Record<string, string>;
}

/**
 * Parse component INSERT statements from SQL file content
 */
export function parseComponentsSql(sqlContent: string): ParsedComponent[] {
  const components: ParsedComponent[] = [];

  // Remove SQL comments
  const cleanedSql = sqlContent.replace(/--.*$/gm, '');

  // Match individual component tuples
  // Pattern: ('type', 'brand', 'model', year, score, '{...}'::jsonb)
  const tupleRegex = /\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'(\{[\s\S]*?\})'\s*::jsonb\s*\)/g;

  let match;
  while ((match = tupleRegex.exec(cleanedSql)) !== null) {
    const [, type, brand, model, releaseYear, benchmarkScore, specsJson] = match;

    try {
      const specs = JSON.parse(specsJson);
      components.push({
        type,
        brand,
        model,
        release_year: parseInt(releaseYear, 10),
        benchmark_score: parseInt(benchmarkScore, 10),
        specs,
      });
    } catch (e) {
      console.error(`Failed to parse specs JSON for ${brand} ${model}:`, e);
    }
  }

  return components;
}

/**
 * Parse game INSERT statements from SQL file content
 */
export function parseGamesSql(sqlContent: string): ParsedGame[] {
  const games: ParsedGame[] = [];

  // Remove SQL comments
  const cleanedSql = sqlContent.replace(/--.*$/gm, '');

  // Match individual game tuples
  // Pattern: ('name', 'steam_id', cpu_weight, gpu_weight, ram_req, '{...}'::jsonb)
  const tupleRegex = /\(\s*'([^']+)'\s*,\s*'([^']*)'\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*(\d+)\s*,\s*'(\{[\s\S]*?\})'\s*::jsonb\s*\)/g;

  let match;
  while ((match = tupleRegex.exec(cleanedSql)) !== null) {
    const [, name, steamId, cpuWeight, gpuWeight, ramReq, specsJson] = match;

    try {
      const specs = JSON.parse(specsJson);
      games.push({
        name,
        steam_id: steamId,
        cpu_weight: parseFloat(cpuWeight),
        gpu_weight: parseFloat(gpuWeight),
        ram_requirement: parseInt(ramReq, 10),
        recommended_specs: specs,
      });
    } catch (e) {
      console.error(`Failed to parse specs JSON for ${name}:`, e);
    }
  }

  return games;
}

/**
 * Check for duplicate components by brand + model
 */
export function findDuplicateComponents(components: ParsedComponent[]): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const comp of components) {
    const key = `${comp.brand} ${comp.model}`;
    if (seen.has(key)) {
      duplicates.push(key);
    } else {
      seen.add(key);
    }
  }

  return duplicates;
}

/**
 * Check for duplicate games by name
 */
export function findDuplicateGames(games: ParsedGame[]): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const game of games) {
    if (seen.has(game.name)) {
      duplicates.push(game.name);
    } else {
      seen.add(game.name);
    }
  }

  return duplicates;
}
