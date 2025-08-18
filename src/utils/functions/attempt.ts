import type { Result } from '../types/result.ts'

export type TransformError<E extends Error> = (error: unknown) => E
export const defaultTransformError: TransformError<Error> = (error) =>
  error instanceof Error ? error : new Error(String(error))

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
export function attempt<T>(fn: () => T): Result<T, Error>
export function attempt<T, E extends Error>(
  fn: () => T,
  transformError: TransformError<E>,
): Result<T, E>
export function attempt<T, E extends Error>(fn: () => T, transformError?: TransformError<E>) {
  try {
    return { data: fn(), error: undefined }
  } catch (error) {
    return {
      data: undefined,
      error: transformError ? transformError(error) : defaultTransformError(error),
    }
  }
}
