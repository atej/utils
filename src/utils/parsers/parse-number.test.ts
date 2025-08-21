import { expect, test } from 'vitest'
import { parseNumber } from './parse-number.ts'

test('parses a number', () => {
  const result = parseNumber(123.456)
  expect(result.success).toBe(true)

  if (result.success) {
    expect(result.data).toBe(123.456)
  }
})

test('parses a negative number', () => {
  const result = parseNumber(-123.456)
  expect(result.success).toBe(true)

  if (result.success) {
    expect(result.data).toBe(-123.456)
  }
})

test('returns a failure for NaN', () => {
  const result = parseNumber(NaN)
  expect(result.success).toBe(false)
})

test('works for Infinity', () => {
  const result = parseNumber(100 / 0)
  expect(result.success).toBe(true)

  if (result.success) {
    expect(result.data).toBe(Infinity)
  }
})

test('works for -Infinity', () => {
  const result = parseNumber(-100 / 0)
  expect(result.success).toBe(true)

  if (result.success) {
    expect(result.data).toBe(-Infinity)
  }
})

test('parses a numeric string', () => {
  const result = parseNumber('123.456')
  expect(result.success).toBe(true)

  if (result.success) {
    expect(result.data).toBe(123.456)
  }
})

test('parses a numeric string with a leading zero', () => {
  const result = parseNumber('0123.456')
  expect(result.success).toBe(true)

  if (result.success) {
    expect(result.data).toBe(123.456)
  }
})

test('parses a negative numeric string', () => {
  const result = parseNumber('-123.456')
  expect(result.success).toBe(true)

  if (result.success) {
    expect(result.data).toBe(-123.456)
  }
})

test('parses "Infinity" as Infinity', () => {
  const result = parseNumber('Infinity')
  expect(result.success).toBe(true)

  if (result.success) {
    expect(result.data).toBe(Infinity)
  }
})

test('parses "-Infinity" as -Infinity', () => {
  const result = parseNumber('-Infinity')
  expect(result.success).toBe(true)

  if (result.success) {
    expect(result.data).toBe(-Infinity)
  }
})

test('returns a failure for a non-numeric string', () => {
  const result = parseNumber('abc')
  expect(result.success).toBe(false)

  if (result.success) {
    expect(result.data).toBeUndefined()
  }
})

test('returns a failure for a bigint', () => {
  const result = parseNumber(BigInt('9999999999999999999999999999'))
  expect(result.success).toBe(false)
})
