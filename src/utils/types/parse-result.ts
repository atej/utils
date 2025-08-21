/**
 * A type representing the result of a parsing operation.
 *
 * @template T - The type that `data` is expected to be if parsing was successful (`success` is `true`).
 */
export type ParseResult<T> =
  | {
    success: true
    data: T
  }
  | {
    success: false
    error: Error
  }
