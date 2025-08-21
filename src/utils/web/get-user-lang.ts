import { isBrowser } from './is-browser.ts'

/**
 * Get the language of the user's browser.
 *
 * @param fallback - Fallback language to use if one could not be determined.
 * @returns The user's language (BCP 47 language code).
 */
export function getUserLang(fallback: string = 'en'): string {
  if (isBrowser()) {
    return navigator.language.split('-')[0] ?? fallback
  }
  return fallback
}
