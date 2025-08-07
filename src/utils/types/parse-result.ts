export type ParseResult<T> =
  | {
      data: T
      success: true
    }
  | {
      data: undefined
      success: false
    }
