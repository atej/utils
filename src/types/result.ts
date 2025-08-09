/**
 * The result of an operation, useful for explicit error handling.
 */
export type Result<T, E extends unknown = unknown> =
  | { data: T; error: undefined }
  | { data: undefined; error: E }
