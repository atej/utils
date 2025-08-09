import type { Result } from '../../types/result'

/**
 * Attempt to execute a function and return a result.
 *
 * @param fn - The function to execute.
 * @param transformError - An optional function to transform the unknown error into a custom error.
 * @returns A result object with the data and error.
 */
export function attempt<T>(fn: () => T): Result<T, unknown>
export function attempt<T, E>(fn: () => T, transformError: (error: unknown) => E): Result<T, E>
export function attempt<T, E>(fn: () => T, transformError?: (error: unknown) => E) {
  try {
    return { data: fn(), error: undefined }
  } catch (error) {
    return {
      data: undefined,
      error: transformError ? transformError(error) : error,
    }
  }
}

/**
 * Attempt to execute an async function and return a result.
 *
 * @param fn - The async function to execute.
 * @param transformError - An optional function to transform the unknown error into a custom error.
 * @returns A result object with the data and error.
 */
export async function attemptAsync<T>(fn: () => Promise<T>): Promise<Result<T, unknown>>
export async function attemptAsync<T, E>(
  fn: () => Promise<T>,
  transformError: (error: unknown) => E,
): Promise<Result<T, E>>
export async function attemptAsync<T, E>(
  fn: () => Promise<T>,
  transformError?: (error: unknown) => E,
) {
  try {
    const data = await fn()
    return { data, error: undefined }
  } catch (error) {
    return {
      data: undefined,
      error: transformError ? transformError(error) : error,
    }
  }
}
