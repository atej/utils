import { join as remedaJoin } from '@remeda/remeda'

/**
 * Joins the elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * When called on a tuple and with stricter item types (union of literal values,
 * the result is strictly typed to the tuples shape and it's item types).
 *
 * @param data - The array to join.
 * @param glue - The string to put in between every two elements.
 * @signature
 *    join(data, glue)
 * @example
 *    join([1,2,3], ",") // => "1,2,3" (typed `string`)
 *    join(['a','b','c'], "") // => "abc" (typed `string`)
 *    join(['hello', 'world'] as const, " ") // => "hello world" (typed `hello world`)
 * @dataFirst
 * @category Array
 */
export const join = remedaJoin
