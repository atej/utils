import { allPass as remedaAllPass } from '@remeda/remeda'

/**
 * Determines whether all predicates returns true for the input data.
 *
 * @param data - The input data for predicates.
 * @param fns - The list of predicates.
 * @signature
 *    allPass(data, fns)
 * @example
 *    const isDivisibleBy3 = (x: number) => x % 3 === 0
 *    const isDivisibleBy4 = (x: number) => x % 4 === 0
 *    const fns = [isDivisibleBy3, isDivisibleBy4]
 *    allPass(12, fns) // => true
 *    allPass(8, fns) // => false
 * @dataFirst
 * @category Array
 */
export const allPass = remedaAllPass
