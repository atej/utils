/**
 * Gathers an error from an unknown value.
 *
 * @param error - The error to gather.
 * @returns The gathered error.
 */
export function gatherError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error))
}
