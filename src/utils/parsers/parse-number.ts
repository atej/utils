import type { ParseResult } from '../types/parse-result.ts'

/**
 * Parses a number from a string or number. Bigints are not supported.
 *
 * @param value - The value to parse.
 * @returns The result of parsing the value.
 */
export function parseNumber(value: unknown): ParseResult<number> {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return {
      success: false,
      error: new Error('Value is not a string or number'),
    }
  }

  if (typeof value === 'number') {
    if (isNaN(value)) {
      return {
        success: false,
        error: new Error('Value is not a valid number'),
      }
    }

    return {
      success: true,
      data: value,
    }
  }

  const parsedString = parseFloat(value)

  if (isNaN(parsedString)) {
    return {
      success: false,
      error: new Error('Value is not a valid number'),
    }
  }

  return {
    success: true,
    data: parsedString,
  }
}
