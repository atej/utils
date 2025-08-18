/**
 * The result of an operation, useful for explicit error handling.
 *
 * @template T - The type of the data returned by the operation if successful.
 * @template E - The type of the error returned by the operation if it fails.
 */
export type Result<T, E extends Error = Error> =
  | { data: T; error: undefined }
  | { data: undefined; error: E }
