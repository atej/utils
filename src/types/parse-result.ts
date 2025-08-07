/**
 * The result of parsing a value using a parsing function.
 *
 * @template T - The type that `data` is expected to be if parsing was successful (`success` is `true`).
 */
export type ParseResult<T> =
  | {
      data: T
      success: true
    }
  | {
      data: undefined
      success: false
    }
