import { isIncludedIn as remedaIsIncludedIn } from '@remeda/remeda'

/**
 * Checks if the item is included in the container. This is a wrapper around
 * `Array.prototype.includes` and `Set.prototype.has` and thus relies on the
 * same equality checks that those functions do (which is reference equality,
 * e.g. `===`). In some cases the input's type is also narrowed to the
 * container's item types.
 *
 * Notice that unlike most functions, this function takes a generic item as it's
 * data and **an array** as it's parameter.
 *
 * @param data - The item that is checked.
 * @param container - The items that are checked against.
 * @returns `true` if the item is in the container, or `false` otherwise. In
 * cases the type of `data` is also narrowed down.
 * @signature
 *   isIncludedIn(data, container);
 * @example
 *   isIncludedIn(2, [1, 2, 3]); // => true
 *   isIncludedIn(4, [1, 2, 3]); // => false
 *
 *   const data = "cat" as "cat" | "dog" | "mouse";
 *   isIncludedIn(data, ["cat", "dog"] as const); // true (typed "cat" | "dog");
 * @dataFirst
 * @category Guard
 */
export const isIncludedIn = remedaIsIncludedIn
