import type { Result } from '../../types/result.ts'

/**
 * Attempt to execute an async function and return a result.
 *
 * @param fn - The async function to execute.
 * @param transformError - An optional function to transform the unknown error into a custom error.
 * @returns A result object with the data and an undefined error, or undefined data and the error.
 * @signature
 *    attemptAsync(fn)
 *    attemptAsync(fn, transformError)
 * @dataFirst
 * @category Function
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
