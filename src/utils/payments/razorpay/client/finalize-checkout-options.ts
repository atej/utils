import { isIncludedIn, keys } from '@remeda/remeda'
import { getUserLang } from '../../../web/get-user-lang.ts'
import type { RAZORPAY_CHECKOUT_LANGS } from '../data.ts'
import type { RazorpayCheckoutOptions } from '../schemas.ts'

export function finalizeRazorpayCheckoutOptions(
  options: RazorpayCheckoutOptions,
  onDismiss?: () => void,
): RazorpayCheckoutOptions {
  const { config, modal, ...rest } = options

  return {
    ...rest,
    modal: { ...modal, ...(onDismiss ? { ondismiss: onDismiss } : {}) },
    config: { ...config, display: { language: getRazorpayCheckoutLang() } },
  }
}

const BCP47_LANG_TO_RAZORPAY_CHECKOUT_LANG = {
  en: 'en',
  bn: 'ben',
  hi: 'hi',
  mr: 'mar',
  gu: 'guj',
  ta: 'tam',
  te: 'tel',
} as const

/**
 * Get the Razorpay checkout modal language from the language of the user's browser.
 *
 * @param userLang - The language of the user's browser.
 * @returns The Razorpay checkout modal language.
 */
type RazorpayCheckoutLang = (typeof RAZORPAY_CHECKOUT_LANGS)[number]
function getRazorpayCheckoutLang(): RazorpayCheckoutLang {
  const userLang = getUserLang()
  return isIncludedIn(userLang, keys(BCP47_LANG_TO_RAZORPAY_CHECKOUT_LANG))
    ? BCP47_LANG_TO_RAZORPAY_CHECKOUT_LANG[userLang]
    : 'en'
}
