import { join } from '@remeda/remeda'

type JoinableItem = bigint | boolean | number | string | null | undefined

/**
 * Joins the truthy elements of the array by: casting them to a string and
 * concatenating them one to the other, with the provided glue string in between
 * every two elements.
 *
 * @param strings - The array of strings to join.
 * @param separator - The separator to use between the strings.
 * @returns The joined string.
 * @signature
 *    joinTruthy(strings, separator)
 * @example
 *    joinTruthy(['Hello', 'World', null], ' ') // => 'Hello World'
 * @dataFirst
 * @category Array
 */
export function joinTruthy<T extends ReadonlyArray<JoinableItem> | [], Glue extends string>(
  data: T,
  glue: Glue,
): string {
  const truthyElements = data.filter(Boolean)
  return join(truthyElements, glue)
}
