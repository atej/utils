import { difference as remedaDifference } from '@remeda/remeda'

/**
 * Excludes the values from `other` array. The output maintains the same order
 * as the input. The inputs are treated as multi-sets/bags (multiple copies of
 * items are treated as unique items).
 *
 * @param data - The input items.
 * @param other - The values to exclude.
 * @signature
 *    difference(data, other)
 * @example
 *    difference([1, 2, 3, 4], [2, 5, 3]); // => [1, 4]
 *    difference([1, 1, 2, 2], [1]); // => [1, 2, 2]
 * @dataFirst
 * @lazy
 * @category Array
 */
export const difference = remedaDifference
