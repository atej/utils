import type { Simplify } from 'type-fest'
import type { FormatCurrencyLocale } from './format-currency.ts'
import { formatNumberInWords, type NumberInWordsOptions } from './format-number-in-words.ts'

const DEFAULT_FORMAT_CURRENCY_IN_WORDS_OPTIONS = {
  ignoreDecimal: false,
  ignoreDecimalFor: ['INR'],
} as const satisfies FormatCurrencyInWordsOptions

/**
 * Formats a currency value to a string representing the amount in words.
 *
 * @param currency - The currency to format.
 * @param value - The value to format.
 * @param options - The options to pass to the formatter.
 * @returns The formatted currency value in words.
 * @signature
 *    formatCurrencyInWords(currency, value)
 *    formatCurrencyInWords(currency, value, options)
 * @category Formatter
 */
export function formatCurrencyInWords(
  currency: string,
  value: number,
  options?: FormatCurrencyInWordsOptions,
): string {
  const locale: FormatCurrencyLocale = currency === 'INR' ? 'en-IN' : 'en-US'

  const mergedOptions = { ...DEFAULT_FORMAT_CURRENCY_IN_WORDS_OPTIONS, ...options }

  const { ignoreDecimal, ignoreDecimalFor, doNotAddOnly, doNotAddOnlyFor, ...restOptions } =
    mergedOptions

  const formatted = formatNumberInWords(value, {
    localeCode: locale,
    converterOptions: {
      ...restOptions,
      currency: true,
      ignoreDecimal: Boolean(ignoreDecimal === true || ignoreDecimalFor?.includes(currency)),
      doNotAddOnly: Boolean(doNotAddOnly === true || doNotAddOnlyFor?.includes(currency)),
    },
  })

  return formatted
}

type FormatCurrencyInWordsOptions = Simplify<
  Omit<NonNullable<NumberInWordsOptions['converterOptions']>, 'currency'> & {
    ignoreDecimalFor?: string[]
    doNotAddOnlyFor?: string[]
  }
>
