import type { ParseResult } from '../../types/parse-result'

/**
 * Parses a number from a string or number. Bigints are not supported.
 *
 * @param value - The value to parse.
 * @returns The result of parsing the value.
 */
export function parseNumber(value: unknown): ParseResult<number> {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return {
      data: undefined,
      success: false,
    }
  }

  if (typeof value === 'number') {
    if (isNaN(value)) {
      return {
        data: undefined,
        success: false,
      }
    }

    return {
      data: value,
      success: true,
    }
  }

  const parsedString = parseFloat(value)

  if (isNaN(parsedString) || !isFinite(parsedString)) {
    return {
      data: undefined,
      success: false,
    }
  }

  return {
    data: parsedString,
    success: true,
  }
}
