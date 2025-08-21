/**
 * A type utility that takes a type parameter `TType` and `TExclude`, and returns a new type with all
 * `TExclude` values excluded from `TType`.
 */
export type OmitBy<TType, TExclude extends unknown = never> = {
  [K in keyof TType]: Exclude<TType[K], TExclude>
}
