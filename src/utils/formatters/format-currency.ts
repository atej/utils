import { joinTruthy } from '../arrays/join-truthy.ts'
import { attempt } from '../functions/attempt.ts'

/**
 * The locale to use for formatting currency.
 */
export type FormatCurrencyLocale = 'en-IN' | 'en-US'

const DEFAULT_FORMAT_CURRENCY_OPTIONS = {
  ignoreDecimal: false,
  ignoreDecimalFor: ['INR'],
} as const satisfies FormatCurrencyOptions

/**
 * Formats a currency value to a string.
 *
 * @param currency - The currency to format.
 * @param value - The value to format.
 * @param options - The options to pass to the formatter.
 * @returns The formatted currency value.
 * @signature
 *    formatCurrency(currency, value)
 *    formatCurrency(currency, value, options)
 * @category Formatter
 */
export function formatCurrency(
  currency: string,
  value: Parameters<Intl.NumberFormat['format']>[0],
  options?: FormatCurrencyOptions,
): string {
  const locale: FormatCurrencyLocale = currency === 'INR' ? 'en-IN' : 'en-US'
  const mergedOptions = { ...DEFAULT_FORMAT_CURRENCY_OPTIONS, ...options }
  const { ignoreDecimal, ignoreDecimalFor, ...restOptions } = mergedOptions

  const { data, error } = attempt(() => {
    const maximumFractionDigits = ignoreDecimal === true || ignoreDecimalFor?.includes(currency)
      ? 0
      : undefined
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits,
      ...restOptions,
    })
    const formatted = formatter.format(value)
    return formatted
  })

  if (error) return joinTruthy([currency, value], ' ')
  return data
}

type FormatCurrencyOptions =
  & Omit<Intl.NumberFormatOptions, 'maximumFractionDigits' | 'style' | 'currency'>
  & { ignoreDecimal?: boolean; ignoreDecimalFor?: string[] }
