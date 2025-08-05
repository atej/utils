type Result<T> =
  | {
      data: T
      success: true
    }
  | {
      data: undefined
      success: false
    }
