import type { Nullable } from './nullable.ts'

/**
 * A type utility to make all values of a type nullable.
 */
export type NullableValues<T> = { [K in keyof T]?: Nullable<T[K]> }
