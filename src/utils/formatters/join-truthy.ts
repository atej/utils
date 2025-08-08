export function joinTruthy(strings: Array<string | null | undefined>, separator: string) {
  return strings.filter(Boolean).join(separator)
}
