/**
 * Join an array of strings, filtering out null and undefined values.
 *
 * @param strings - The array of strings to join.
 * @param separator - The separator to use between the strings.
 * @returns The joined string.
 */
export function joinTruthy(strings: Array<string | null | undefined>, separator: string): string {
  return strings.filter(Boolean).join(separator)
}
