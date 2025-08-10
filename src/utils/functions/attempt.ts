import type { Result } from '../../types/result.ts'

/**
 * Attempt to execute a function and return a result.
 *
 * @param fn - The function to execute.
 * @param transformError - An optional function to transform the unknown error into a custom error.
 * @returns A result object with the data and an undefined error, or undefined data and the error.
 * @signature
 *    attempt(fn)
 *    attempt(fn, transformError)
 * @dataFirst
 * @category Function
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
