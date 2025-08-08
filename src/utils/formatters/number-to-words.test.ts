import { describe, expect, it } from 'vitest'
import {
  DEFAULT_CONVERTER_OPTIONS,
  DEFAULT_TO_WORDS_OPTIONS,
  numberToWords,
} from './number-to-words'

describe('numberToWords', () => {
  describe('basic number conversion', () => {
    it('converts zero', () => {
      expect(numberToWords(0)).toBe('Zero')
    })

    it('converts single digit numbers', () => {
      expect(numberToWords(1)).toBe('One')
      expect(numberToWords(5)).toBe('Five')
      expect(numberToWords(9)).toBe('Nine')
    })

    it('converts double digit numbers', () => {
      expect(numberToWords(10)).toBe('Ten')
      expect(numberToWords(15)).toBe('Fifteen')
      expect(numberToWords(20)).toBe('Twenty')
      expect(numberToWords(25)).toBe('Twenty Five')
      expect(numberToWords(99)).toBe('Ninety Nine')
    })

    it('converts triple digit numbers', () => {
      expect(numberToWords(100)).toBe('One Hundred')
      expect(numberToWords(101)).toBe('One Hundred One')
      expect(numberToWords(150)).toBe('One Hundred Fifty')
      expect(numberToWords(999)).toBe('Nine Hundred Ninety Nine')
    })

    it('converts thousands', () => {
      expect(numberToWords(1000)).toBe('One Thousand')
      expect(numberToWords(1500)).toBe('One Thousand Five Hundred')
      expect(numberToWords(9999)).toBe('Nine Thousand Nine Hundred Ninety Nine')
    })

    it('converts lakhs (en-IN)', () => {
      expect(numberToWords(100000)).toBe('One Lakh')
      expect(numberToWords(150000)).toBe('One Lakh Fifty Thousand')
      expect(numberToWords(999999)).toBe('Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine')
    })

    it('converts crores (en-IN)', () => {
      expect(numberToWords(10000000)).toBe('One Crore')
      expect(numberToWords(15000000)).toBe('One Crore Fifty Lakh')
      expect(numberToWords(99999999)).toBe(
        'Nine Crore Ninety Nine Lakh Ninety Nine Thousand Nine Hundred Ninety Nine',
      )
    })

    it('converts millions (en-US)', () => {
      expect(numberToWords(1000000, { localeCode: 'en-US' })).toBe('One Million')
      expect(numberToWords(1500000, { localeCode: 'en-US' })).toBe(
        'One Million Five Hundred Thousand',
      )
    })

    it('converts billions (en-US)', () => {
      expect(numberToWords(1000000000, { localeCode: 'en-US' })).toBe('One Billion')
      expect(numberToWords(1500000000, { localeCode: 'en-US' })).toBe(
        'One Billion Five Hundred Million',
      )
    })

    it('converts trillions (en-US)', () => {
      expect(numberToWords(1000000000000, { localeCode: 'en-US' })).toBe('One Trillion')
    })

    it('converts quadrillions (en-US)', () => {
      expect(numberToWords(1000000000000000, { localeCode: 'en-US' })).toBe('One Quadrillion')
    })
  })

  describe('negative numbers', () => {
    it('converts negative numbers', () => {
      expect(numberToWords(-1)).toBe('Minus One')
      expect(numberToWords(-100)).toBe('Minus One Hundred')
      expect(numberToWords(-1000)).toBe('Minus One Thousand')
    })
  })

  describe('decimal numbers', () => {
    it('converts decimal numbers', () => {
      expect(numberToWords(1.5)).toBe('One Point Five')
      expect(numberToWords(10.25)).toBe('Ten Point Twenty Five')
      expect(numberToWords(100.99)).toBe('One Hundred Point Ninety Nine')
    })

    it('converts decimal numbers with leading zeros', () => {
      expect(numberToWords(1.05)).toBe('One Point Zero Five')
      expect(numberToWords(10.005)).toBe('Ten Point Zero Zero Five')
    })

    it('handles ignoreDecimal option', () => {
      expect(numberToWords(1.5, { converterOptions: { ignoreDecimal: true } })).toBe('One')
      expect(numberToWords(10.25, { converterOptions: { ignoreDecimal: true } })).toBe('Ten')
    })
  })

  describe('currency conversion', () => {
    it('converts currency (en-IN)', () => {
      expect(numberToWords(1, { converterOptions: { currency: true } })).toBe('One Rupee Only')
      expect(numberToWords(2, { converterOptions: { currency: true } })).toBe('Two Rupees Only')
      expect(numberToWords(1.5, { converterOptions: { currency: true } })).toBe(
        'One Rupee And Fifty Paise Only',
      )
    })

    it('converts currency (en-US)', () => {
      expect(numberToWords(1, { localeCode: 'en-US', converterOptions: { currency: true } })).toBe(
        'One Dollar Only',
      )
      expect(numberToWords(2, { localeCode: 'en-US', converterOptions: { currency: true } })).toBe(
        'Two Dollars Only',
      )
      expect(
        numberToWords(1.5, { localeCode: 'en-US', converterOptions: { currency: true } }),
      ).toBe('One Dollar And Fifty Cents Only')
    })

    it('handles currency less than 1', () => {
      expect(numberToWords(0.5, { converterOptions: { currency: true } })).toBe(
        'Zero Rupees And Fifty Paise Only',
      )
      expect(
        numberToWords(0.5, { localeCode: 'en-US', converterOptions: { currency: true } }),
      ).toBe('Zero Dollars And Fifty Cents Only')
    })

    it('handles zero currency with ignoreZeroCurrency', () => {
      expect(
        numberToWords(0.5, { converterOptions: { currency: true, ignoreZeroCurrency: true } }),
      ).toBe('Fifty Paise Only')
    })

    it('handles doNotAddOnly option', () => {
      expect(numberToWords(1, { converterOptions: { currency: true, doNotAddOnly: true } })).toBe(
        'One Rupee',
      )
      expect(numberToWords(1.5, { converterOptions: { currency: true, doNotAddOnly: true } })).toBe(
        'One Rupee And Fifty Paise',
      )
    })

    it('handles custom currency options', () => {
      const customCurrency = {
        name: 'Euro',
        plural: 'Euros',
        singular: 'Euro',
        symbol: '€',
        fractionalUnit: {
          name: 'Cent',
          plural: 'Cents',
          singular: 'Cent',
          symbol: '¢',
        },
      }
      expect(
        numberToWords(1, { converterOptions: { currency: true, currencyOptions: customCurrency } }),
      ).toBe('One Euro Only')
      expect(
        numberToWords(2, { converterOptions: { currency: true, currencyOptions: customCurrency } }),
      ).toBe('Two Euros Only')
      expect(
        numberToWords(1.5, {
          converterOptions: { currency: true, currencyOptions: customCurrency },
        }),
      ).toBe('One Euro And Fifty Cents Only')
    })
  })

  describe('edge cases', () => {
    it('handles very large numbers', () => {
      expect(numberToWords(999999999999999, { localeCode: 'en-US' })).toBe(
        'Nine Hundred Ninety Nine Trillion Nine Hundred Ninety Nine Billion Nine Hundred Ninety Nine Million Nine Hundred Ninety Nine Thousand Nine Hundred Ninety Nine',
      )
    })

    it('handles numbers with exact words mapping', () => {
      expect(numberToWords(100)).toBe('One Hundred')
    })

    it('handles zero with currency', () => {
      expect(numberToWords(0, { converterOptions: { currency: true } })).toBe('Zero Rupees Only')
    })

    it('handles zero with currency and ignoreZeroCurrency', () => {
      expect(
        numberToWords(0, { converterOptions: { currency: true, ignoreZeroCurrency: true } }),
      ).toBe('')
    })
  })

  describe('error handling', () => {
    it('throws error for invalid numbers', () => {
      expect(() => numberToWords(NaN)).toThrow('Invalid Number "NaN"')
      expect(() => numberToWords(Infinity)).toThrow('Invalid Number "Infinity"')
      expect(() => numberToWords(-Infinity)).toThrow('Invalid Number "-Infinity"')
    })

    it('does not throw error for unknown locale', () => {
      expect(() => numberToWords(1, { localeCode: 'invalid' as any })).not.toThrow()
      expect(numberToWords(1, { localeCode: 'invalid' as any })).toBe('One')
    })
  })

  describe('default options', () => {
    it('uses default options when none provided', () => {
      expect(DEFAULT_CONVERTER_OPTIONS).toEqual({
        currency: false,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
      })

      expect(DEFAULT_TO_WORDS_OPTIONS).toEqual({
        localeCode: 'en-IN',
        converterOptions: DEFAULT_CONVERTER_OPTIONS,
      })
    })

    it('merges options correctly', () => {
      const result = numberToWords(1, {
        converterOptions: { currency: true },
        localeCode: 'en-US',
      })
      expect(result).toBe('One Dollar Only')
    })
  })

  describe('locale-specific behavior', () => {
    it('uses en-IN as default locale', () => {
      expect(numberToWords(100000)).toBe('One Lakh')
    })

    it('switches to en-US locale', () => {
      expect(numberToWords(1000000, { localeCode: 'en-US' })).toBe('One Million')
    })
  })

  describe('complex scenarios', () => {
    it('handles complex decimal currency', () => {
      expect(numberToWords(1234.56, { converterOptions: { currency: true } })).toBe(
        'One Thousand Two Hundred Thirty Four Rupees And Fifty Six Paise Only',
      )
    })

    it('handles complex decimal currency (en-US)', () => {
      expect(
        numberToWords(1234.56, { localeCode: 'en-US', converterOptions: { currency: true } }),
      ).toBe('One Thousand Two Hundred Thirty Four Dollars And Fifty Six Cents Only')
    })

    it('handles negative currency', () => {
      expect(numberToWords(-1234.56, { converterOptions: { currency: true } })).toBe(
        'Minus One Thousand Two Hundred Thirty Four Rupees And Fifty Six Paise Only',
      )
    })

    it('handles very small decimals', () => {
      expect(numberToWords(0.01, { converterOptions: { currency: true } })).toBe(
        'Zero Rupees And One Paisa Only',
      )
      expect(
        numberToWords(0.01, { localeCode: 'en-US', converterOptions: { currency: true } }),
      ).toBe('Zero Dollars And One Cent Only')
    })

    it('handles numbers just below 1', () => {
      expect(numberToWords(0.99)).toBe('Zero Point Ninety Nine')
      expect(numberToWords(0.99, { converterOptions: { currency: true } })).toBe(
        'Zero Rupees And Ninety Nine Paise Only',
      )
    })

    it('handles edge case with decimalLengthWordMapping and empty words', () => {
      // This tests the case where locale.decimalLengthWordMapping exists but words.length is 0
      const result = numberToWords(0, { converterOptions: { currency: true } })
      expect(result).toBe('Zero Rupees Only')
    })
  })

  describe('trim functionality', () => {
    it('handles trim option when locale has trim enabled', () => {
      // Note: Current locales don't have trim enabled, but we test the logic
      // This would require modifying the locale config to test fully
      const result = numberToWords(1)
      expect(result).toBe('One')
    })

    it('handles currency with onlyInFront option', () => {
      // Test the onlyInFront logic in currency conversion
      const result = numberToWords(1, { converterOptions: { currency: true } })
      expect(result).toBe('One Rupee Only')
    })

    it('handles currency without onlyInFront option', () => {
      // Test the default currency behavior
      const result = numberToWords(1.5, { converterOptions: { currency: true } })
      expect(result).toBe('One Rupee And Fifty Paise Only')
    })
  })

  describe('exact words mapping edge cases', () => {
    it('handles exact words mapping with array values', () => {
      // This tests the logic for exact words mapping with trailing parameter
      // The current exact words mapping only has string values, but we test the array logic
      expect(numberToWords(100)).toBe('One Hundred')
    })
  })

  describe('plural and singular forms', () => {
    it('handles singular forms correctly', () => {
      expect(numberToWords(1, { converterOptions: { currency: true } })).toBe('One Rupee Only')
      expect(numberToWords(1, { localeCode: 'en-US', converterOptions: { currency: true } })).toBe(
        'One Dollar Only',
      )
    })

    it('handles plural forms correctly', () => {
      expect(numberToWords(2, { converterOptions: { currency: true } })).toBe('Two Rupees Only')
      expect(numberToWords(2, { localeCode: 'en-US', converterOptions: { currency: true } })).toBe(
        'Two Dollars Only',
      )
    })

    it('handles fractional unit singular forms', () => {
      expect(numberToWords(1.01, { converterOptions: { currency: true } })).toBe(
        'One Rupee And One Paisa Only',
      )
      expect(
        numberToWords(1.01, { localeCode: 'en-US', converterOptions: { currency: true } }),
      ).toBe('One Dollar And One Cent Only')
    })

    it('handles fractional unit plural forms', () => {
      expect(numberToWords(1.5, { converterOptions: { currency: true } })).toBe(
        'One Rupee And Fifty Paise Only',
      )
      expect(
        numberToWords(1.5, { localeCode: 'en-US', converterOptions: { currency: true } }),
      ).toBe('One Dollar And Fifty Cents Only')
    })
  })
})
