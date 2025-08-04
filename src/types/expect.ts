/**
 * Type assertion utility that only accepts `true` values.
 * Used in type-level tests to ensure a condition evaluates to `true`.
 *
 * @template T - The type to assert, must extend `true`
 * @returns T if T extends true, otherwise causes a type error
 *
 * @example
 * ```typescript
 * type Test1 = Expect<true>; // ✅ OK
 * type Test2 = Expect<false>; // ❌ Type error
 * type Test3 = Expect<Equal<string, string>>; // ✅ OK if Equal returns true
 * ```
 */
export type Expect<T extends true> = T
