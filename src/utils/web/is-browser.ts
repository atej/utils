/**
 * Check if code is running in a browser.
 */
export function isBrowser(): boolean {
  return typeof document !== 'undefined'
}
