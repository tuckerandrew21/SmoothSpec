/**
 * Typed error handling utilities for SmoothSpec
 * Provides structured error types and operation result patterns
 */

// Error codes for categorization
export enum ErrorCode {
  // Data fetching errors
  COMPONENT_FETCH_FAILED = 'COMPONENT_FETCH_FAILED',
  GAME_FETCH_FAILED = 'GAME_FETCH_FAILED',
  PRICE_FETCH_FAILED = 'PRICE_FETCH_FAILED',

  // Analysis errors
  ANALYSIS_FAILED = 'ANALYSIS_FAILED',
  PARTIAL_DATA = 'PARTIAL_DATA',

  // API errors
  BESTBUY_API_ERROR = 'BESTBUY_API_ERROR',
  SUPABASE_ERROR = 'SUPABASE_ERROR',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',

  // Validation errors
  INVALID_BUILD_DATA = 'INVALID_BUILD_DATA',
  JSON_PARSE_ERROR = 'JSON_PARSE_ERROR',
}

// Custom error class with metadata
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public userMessage: string,
    public recoverable: boolean = true,
    public metadata?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Partial failure tracking
export interface PartialFailure {
  operation: string
  error: string
}

// Result type for operations that can partially succeed
export interface OperationResult<T> {
  data: T
  warnings: string[]
  partialFailures: PartialFailure[]
}

// Helper to create a successful result with no issues
export function successResult<T>(data: T): OperationResult<T> {
  return {
    data,
    warnings: [],
    partialFailures: [],
  }
}

// Helper to create a result with warnings
export function resultWithWarnings<T>(
  data: T,
  warnings: string[]
): OperationResult<T> {
  return {
    data,
    warnings,
    partialFailures: [],
  }
}

// Helper to merge multiple operation results
export function mergeResults<T>(
  results: OperationResult<T>[],
  dataMerger: (data: T[]) => T
): OperationResult<T> {
  return {
    data: dataMerger(results.map((r) => r.data)),
    warnings: results.flatMap((r) => r.warnings),
    partialFailures: results.flatMap((r) => r.partialFailures),
  }
}

// Data quality indicator based on partial failures
export type DataQuality = 'complete' | 'partial' | 'degraded'

export function assessDataQuality(
  partialFailures: PartialFailure[]
): DataQuality {
  if (partialFailures.length === 0) return 'complete'
  if (partialFailures.length <= 2) return 'partial'
  return 'degraded'
}
