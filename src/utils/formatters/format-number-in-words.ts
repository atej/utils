/**
 * Fork of [to-words](https://github.com/mastermunj/to-words)
 *
 * This module provides a function to convert a number to words in a given locale.
 * Decimal numbers as well as currency are supported.
 *
 * Locales supported:
 * - en-IN: Indian English
 * - en-US: US English
 *
 * Default currency options for supported locales:
 * - en-IN: Rupee, Paisa
 * - en-US: Dollar, Cent
 *
 * @module
 */

/**
 * Currency formatting options
 */
export type NumberInWordsCurrencyOptions = {
  /**
   * The name of the currency @example 'Rupee'
   */
  name: string
  /**
   * The plural form of the currency @example 'Rupees'
   */
  plural: string
  /**
   * The symbol of the currency @example '₹'
   */
  symbol: string
  /**
   * The singular form of the currency @example 'Rupee'
   */
  singular?: string
  /**
   * Option for formatting the fractional unit of the currency
   */
  fractionalUnit: {
    /**
     * The fractional unit of the currency @example 'Paisa'
     */
    name: string
    /**
     * The plural form of the fractional unit @example 'Paise'
     */
    plural: string
    /**
     * The singular form of the fractional unit @example 'Paisa'
     */
    singular?: string
    /**
     * The symbol of the fractional unit, leave empty for no symbol @example '¢'
     */
    symbol: string
  }
}

type NumberInWordsConverterOptions = {
  /**
   * Whether to convert the number to words in currency format
   * @default false
   */
  currency?: boolean
  /**
   * Whether to ignore the decimal part of the number
   * @default false
   */
  ignoreDecimal?: boolean
  /**
   * Whether to ignore the zero currency part of the number
   * @default false
   */
  ignoreZeroCurrency?: boolean
  /**
   * Whether to not add the 'Only' word to the end of the number. Applicable only when `currency` is `true`
   * @default false
   */
  doNotAddOnly?: boolean
  /**
   * Options for the currency. Applicable only when `currency` is `true`, overwrites the currency options of the locale config
   */
  currencyOptions?: NumberInWordsCurrencyOptions
}

type NumberInWordsOptions = {
  /**
   * The locale code to use for the conversion
   * @default 'en-IN'
   */
  localeCode?: 'en-IN' | 'en-US'
  converterOptions?: NumberInWordsConverterOptions
}

type NumberWordMap = {
  number: number
  value: string | [string, string]
  singularValue?: string
}

type NumberInWordsLocaleConfig = {
  currency: NumberInWordsCurrencyOptions
  texts: {
    and: string
    minus: string
    only: string
    point: string
  }
  numberWordsMapping: NumberWordMap[]
  exactWordsMapping?: NumberWordMap[]
  namedLessThan1000?: boolean
  splitWord?: string
  ignoreZeroInDecimals?: boolean
  decimalLengthWordMapping?: Record<number, string>
  ignoreOneForWords?: string[]
  pluralMark?: string
  pluralWords?: string[]
  noSplitWordAfter?: string[]
  onlyInFront?: boolean
  trim?: boolean
}

type LocaleCode = 'en-IN' | 'en-US'

const LOCALES: Record<LocaleCode, NumberInWordsLocaleConfig> = {
  'en-IN': {
    currency: {
      name: 'Rupee',
      plural: 'Rupees',
      singular: 'Rupee',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        singular: 'Paisa',
        symbol: '',
      },
    },
    texts: {
      and: 'And',
      minus: 'Minus',
      only: 'Only',
      point: 'Point',
    },
    numberWordsMapping: [
      { number: 10000000, value: 'Crore' },
      { number: 100000, value: 'Lakh' },
      { number: 1000, value: 'Thousand' },
      { number: 100, value: 'Hundred' },
      { number: 90, value: 'Ninety' },
      { number: 80, value: 'Eighty' },
      { number: 70, value: 'Seventy' },
      { number: 60, value: 'Sixty' },
      { number: 50, value: 'Fifty' },
      { number: 40, value: 'Forty' },
      { number: 30, value: 'Thirty' },
      { number: 20, value: 'Twenty' },
      { number: 19, value: 'Nineteen' },
      { number: 18, value: 'Eighteen' },
      { number: 17, value: 'Seventeen' },
      { number: 16, value: 'Sixteen' },
      { number: 15, value: 'Fifteen' },
      { number: 14, value: 'Fourteen' },
      { number: 13, value: 'Thirteen' },
      { number: 12, value: 'Twelve' },
      { number: 11, value: 'Eleven' },
      { number: 10, value: 'Ten' },
      { number: 9, value: 'Nine' },
      { number: 8, value: 'Eight' },
      { number: 7, value: 'Seven' },
      { number: 6, value: 'Six' },
      { number: 5, value: 'Five' },
      { number: 4, value: 'Four' },
      { number: 3, value: 'Three' },
      { number: 2, value: 'Two' },
      { number: 1, value: 'One' },
      { number: 0, value: 'Zero' },
    ],
    exactWordsMapping: [{ number: 100, value: 'One Hundred' }],
  },
  'en-US': {
    currency: {
      name: 'Dollar',
      plural: 'Dollars',
      singular: 'Dollar',
      symbol: '$',
      fractionalUnit: {
        name: 'Cent',
        plural: 'Cents',
        singular: 'Cent',
        symbol: '¢',
      },
    },
    texts: {
      and: 'And',
      minus: 'Minus',
      only: 'Only',
      point: 'Point',
    },
    numberWordsMapping: [
      { number: 1000000000000000, value: 'Quadrillion' },
      { number: 1000000000000, value: 'Trillion' },
      { number: 1000000000, value: 'Billion' },
      { number: 1000000, value: 'Million' },
      { number: 1000, value: 'Thousand' },
      { number: 100, value: 'Hundred' },
      { number: 90, value: 'Ninety' },
      { number: 80, value: 'Eighty' },
      { number: 70, value: 'Seventy' },
      { number: 60, value: 'Sixty' },
      { number: 50, value: 'Fifty' },
      { number: 40, value: 'Forty' },
      { number: 30, value: 'Thirty' },
      { number: 20, value: 'Twenty' },
      { number: 19, value: 'Nineteen' },
      { number: 18, value: 'Eighteen' },
      { number: 17, value: 'Seventeen' },
      { number: 16, value: 'Sixteen' },
      { number: 15, value: 'Fifteen' },
      { number: 14, value: 'Fourteen' },
      { number: 13, value: 'Thirteen' },
      { number: 12, value: 'Twelve' },
      { number: 11, value: 'Eleven' },
      { number: 10, value: 'Ten' },
      { number: 9, value: 'Nine' },
      { number: 8, value: 'Eight' },
      { number: 7, value: 'Seven' },
      { number: 6, value: 'Six' },
      { number: 5, value: 'Five' },
      { number: 4, value: 'Four' },
      { number: 3, value: 'Three' },
      { number: 2, value: 'Two' },
      { number: 1, value: 'One' },
      { number: 0, value: 'Zero' },
    ],
    exactWordsMapping: [{ number: 100, value: 'One Hundred' }],
  },
}

export const DEFAULT_CONVERTER_OPTIONS = {
  currency: false,
  ignoreDecimal: false,
  ignoreZeroCurrency: false,
  doNotAddOnly: false,
} satisfies NumberInWordsConverterOptions

export const DEFAULT_TO_WORDS_OPTIONS = {
  localeCode: 'en-IN',
  converterOptions: DEFAULT_CONVERTER_OPTIONS,
} satisfies NumberInWordsOptions

function getLocale(localeCode: string): NumberInWordsLocaleConfig {
  const locale = localeCode in LOCALES
    ? LOCALES[localeCode as LocaleCode]
    : LOCALES[DEFAULT_TO_WORDS_OPTIONS.localeCode]
  return locale
}

function toFixed(number: number, precision = 2): number {
  return Number(Number(number).toFixed(precision))
}

function isFloat(number: number | string): boolean {
  return Number(number) === number && number % 1 !== 0
}

function isValidNumber(number: number | string): boolean {
  return !isNaN(parseFloat(number as string)) && isFinite(number as number)
}

function isNumberZero(number: number): boolean {
  return number >= 0 && number < 1
}

function convertInternal(
  number: number,
  locale: NumberInWordsLocaleConfig,
  trailing: boolean = false,
): string[] {
  if (locale.exactWordsMapping) {
    const exactMatch = locale.exactWordsMapping.find((elem) => {
      return number === elem.number
    })
    if (exactMatch) {
      const value = Array.isArray(exactMatch.value) ? exactMatch.value[+trailing] : exactMatch.value
      return [
        value ??
          (Array.isArray(exactMatch.value) ? exactMatch.value[0] : exactMatch.value),
      ]
    }
  }

  const match = locale.numberWordsMapping.find((elem) => {
    return number >= elem.number
  })

  if (!match) {
    throw new Error(`No matching number word found for ${number}`)
  }

  const words: string[] = []
  if (number <= 100 || (number < 1000 && locale.namedLessThan1000)) {
    words.push(Array.isArray(match.value) ? match.value[0] : match.value)
    number -= match.number
    if (number > 0) {
      if (locale.splitWord?.length) {
        words.push(locale.splitWord)
      }
      words.push(...convertInternal(number, locale, trailing))
    }
    return words
  }

  const quotient = Math.floor(number / match.number)
  const remainder = number % match.number
  let matchValue: string = Array.isArray(match.value) ? match.value[0] : match.value
  if (
    quotient > 1 &&
    locale.pluralWords?.find((word) => word === match.value) &&
    locale.pluralMark
  ) {
    matchValue += locale.pluralMark
  }
  if (quotient % 10 === 1) {
    const fallbackValue = Array.isArray(matchValue) ? (matchValue[0] ?? matchValue) : matchValue
    matchValue = match.singularValue ?? fallbackValue
  }
  if (quotient === 1 && locale.ignoreOneForWords?.includes(matchValue)) {
    words.push(matchValue)
  } else {
    words.push(...convertInternal(quotient, locale, false), matchValue)
  }

  if (remainder > 0) {
    if (locale.splitWord?.length) {
      if (!locale.noSplitWordAfter?.find((word) => word === match.value)) {
        words.push(locale.splitWord)
      }
    }
    words.push(...convertInternal(remainder, locale, trailing))
  }
  return words
}

function convertNumber(
  number: number,
  locale: NumberInWordsLocaleConfig,
): string[] {
  const isNegativeNumber = number < 0
  if (isNegativeNumber) {
    number = Math.abs(number)
  }

  const split = number.toString().split('.')
  const ignoreZero = isNumberZero(number) && locale.ignoreZeroInDecimals
  let words = convertInternal(Number(split[0]), locale, true)
  const isFloatNumber = isFloat(number)
  if (isFloatNumber && ignoreZero) {
    words = []
  }
  const wordsWithDecimal = []
  if (isFloatNumber) {
    if (!ignoreZero) {
      wordsWithDecimal.push(locale.texts.point)
    }
    if (split[1]?.startsWith('0') && !locale.decimalLengthWordMapping) {
      const zeroWords = []
      for (const num of split[1]) {
        zeroWords.push(...convertInternal(Number(num), locale, true))
      }
      wordsWithDecimal.push(...zeroWords)
    } else if (split[1]) {
      wordsWithDecimal.push(...convertInternal(Number(split[1]), locale, true))
      const decimalLengthWord = locale.decimalLengthWordMapping?.[split[1].length]
      if (decimalLengthWord) {
        wordsWithDecimal.push(decimalLengthWord)
      }
    }
  }
  const isEmpty = words.length <= 0
  if (!isEmpty && isNegativeNumber) {
    words.unshift(locale.texts.minus)
  }
  words.push(...wordsWithDecimal)
  return words
}

function convertCurrency(
  number: number,
  locale: NumberInWordsLocaleConfig,
  options: NumberInWordsConverterOptions = {},
): string[] {
  const currencyOptions = options.currencyOptions ?? locale.currency

  const isNegativeNumber = number < 0
  if (isNegativeNumber) {
    number = Math.abs(number)
  }

  number = toFixed(number)
  // Extra check for isFloat to overcome 1.999 rounding off to 2
  const split = number.toString().split('.')
  let words = [...convertInternal(Number(split[0]), locale)]
  // Determine if the main currency should be in singular form
  // e.g. 1 Dollar Only instead of 1 Dollars Only

  if (Number(split[0]) === 1 && currencyOptions.singular) {
    words.push(currencyOptions.singular)
  } else if (currencyOptions.plural) {
    words.push(currencyOptions.plural)
  }
  const ignoreZero = isNumberZero(number) &&
    (options.ignoreZeroCurrency ||
      (locale.ignoreZeroInDecimals && number !== 0))

  if (ignoreZero) {
    words = []
  }

  const wordsWithDecimal = []
  const isFloatNumber = isFloat(number)
  if (isFloatNumber) {
    if (!ignoreZero) {
      wordsWithDecimal.push(locale.texts.and)
    }
    const decimalPart = Number(split[1]) *
      (!locale.decimalLengthWordMapping ? Math.pow(10, 2 - (split[1]?.length ?? 0)) : 1)
    wordsWithDecimal.push(...convertInternal(decimalPart, locale))
    const decimalLengthWord = locale.decimalLengthWordMapping?.[split[1]?.length ?? 0]
    if (decimalLengthWord?.length) {
      wordsWithDecimal.push(decimalLengthWord)
    }
    // Determine if the fractional unit should be in singular form
    // e.g. 1 Dollar and 1 Cent Only instead of 1 Dollar and 1 Cents Only
    if (decimalPart === 1 && currencyOptions.fractionalUnit.singular) {
      wordsWithDecimal.push(currencyOptions.fractionalUnit.singular)
    } else {
      wordsWithDecimal.push(currencyOptions.fractionalUnit.plural)
    }
  } else if (locale.decimalLengthWordMapping && words.length) {
    wordsWithDecimal.push(currencyOptions.fractionalUnit.plural)
  }
  const isEmpty = words.length <= 0 && wordsWithDecimal.length <= 0
  if (!isEmpty && isNegativeNumber) {
    words.unshift(locale.texts.minus)
  }
  if (
    !isEmpty &&
    locale.texts.only &&
    !options.doNotAddOnly &&
    !locale.onlyInFront
  ) {
    wordsWithDecimal.push(locale.texts.only)
  }
  if (wordsWithDecimal.length) {
    words.push(...wordsWithDecimal)
  }

  if (!isEmpty && !options.doNotAddOnly && locale.onlyInFront) {
    words.splice(0, 0, locale.texts.only)
  }

  return words
}

/**
 * Converts a number to words in a given locale (including decimals and currency).
 * @param number - The number to convert.
 * @param options - The options for the conversion.
 * @returns The number in words.
 *
 * @category Formatter
 */
export function formatNumberInWords(
  number: number,
  options: NumberInWordsOptions = {},
): string {
  const mergedOptions = { ...DEFAULT_TO_WORDS_OPTIONS, ...options }
  const localeCode = mergedOptions.localeCode
  const locale = getLocale(localeCode)
  const converterOptions = Object.assign(
    {},
    mergedOptions.converterOptions,
    options.converterOptions,
  )

  if (!isValidNumber(number)) {
    throw new Error(`Invalid Number "${number}"`)
  }

  if (converterOptions.ignoreDecimal) {
    number = Number.parseInt(number.toString())
  }

  let words: string[] = []
  if (converterOptions.currency) {
    words = convertCurrency(number, locale, converterOptions)
  } else {
    words = convertNumber(number, locale)
  }

  if (locale.trim) {
    return words.join('')
  }

  return words.join(' ')
}
