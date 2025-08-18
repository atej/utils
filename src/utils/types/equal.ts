/**
 * Type-level equality check that compares two types for structural equality.
 * Uses a technique with conditional types to perform deep type comparison.
 *
 * @example
 *   ```typescript
 *   type Test1 = Equal<string, string>; // true
 *   type Test2 = Equal<string, number>; // false
 *   type Test3 = Equal<{a: string}, {a: string}>; // true
 *   type Test4 = Equal<{a: string}, {a: number}>; // false
 *   type Test5 = Equal<[1, 2, 3], [1, 2, 3]>; // true
 *   type Test6 = Equal<[1, 2, 3], [1, 2]>; // false
 *   ```
 *
 * @template X - The first type to compare
 * @template Y - The second type to compare
 * @returns `true` if X and Y are structurally equal, `false` otherwise
 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true
  : false
