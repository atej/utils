import { expect, test } from 'vitest'
import { parseNumber } from './parse-number'

test('parses a number', () => {
  const result = parseNumber(123.456)
  expect(result.success).toBe(true)
  expect(result.data).toBe(123.456)
})

test('parses a negative number', () => {
  const result = parseNumber(-123.456)
  expect(result.success).toBe(true)
  expect(result.data).toBe(-123.456)
})

test('returns a failure for NaN', () => {
  const result = parseNumber(NaN)
  expect(result.success).toBe(false)
  expect(result.data).toBeUndefined()
})

test('works for Infinity', () => {
  const result = parseNumber(100 / 0)
  expect(result.success).toBe(true)
  expect(result.data).toBe(Infinity)
})

test('works for -Infinity', () => {
  const result = parseNumber(-100 / 0)
  expect(result.success).toBe(true)
  expect(result.data).toBe(-Infinity)
})

test('parses a numeric string', () => {
  const result = parseNumber('123.456')
  expect(result.success).toBe(true)
  expect(result.data).toBe(123.456)
})

test('parses a negative numeric string', () => {
  const result = parseNumber('-123.456')
  expect(result.success).toBe(true)
  expect(result.data).toBe(-123.456)
})

test('returns a failure for a non-numeric string', () => {
  const result = parseNumber('abc')
  expect(result.success).toBe(false)
  expect(result.data).toBeUndefined()
})

test('returns a failure for a bigint', () => {
  const result = parseNumber(BigInt('9999999999999999999999999999'))
  expect(result.success).toBe(false)
  expect(result.data).toBeUndefined()
})
