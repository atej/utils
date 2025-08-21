import { Buffer } from 'node:buffer'
import z from 'zod/v4'
import { RAZORPAY_CURRENCIES, RAZORPAY_CURRENCY_CODES } from './data.ts'

/**
 * Zod schema that validates a Razorpay currency code.
 *
 * @see https://razorpay.com/docs/payments/international-payments#supported-currencies
 */
export type RazorpayCurrencyCodeZodSchema = z.ZodEnum<{
  AED: 'AED'
  ALL: 'ALL'
  AMD: 'AMD'
  AUD: 'AUD'
  AWG: 'AWG'
  AZN: 'AZN'
  BAM: 'BAM'
  BBD: 'BBD'
  BDT: 'BDT'
  BGN: 'BGN'
  BHD: 'BHD'
  BIF: 'BIF'
  BMD: 'BMD'
  BND: 'BND'
  BOB: 'BOB'
  BRL: 'BRL'
  BSD: 'BSD'
  BTN: 'BTN'
  BWP: 'BWP'
  BZD: 'BZD'
  CAD: 'CAD'
  CHF: 'CHF'
  CLP: 'CLP'
  CNY: 'CNY'
  COP: 'COP'
  CRC: 'CRC'
  CUP: 'CUP'
  CVE: 'CVE'
  CZK: 'CZK'
  DJF: 'DJF'
  DKK: 'DKK'
  DOP: 'DOP'
  DZD: 'DZD'
  EGP: 'EGP'
  ETB: 'ETB'
  EUR: 'EUR'
  FJD: 'FJD'
  GBP: 'GBP'
  GHS: 'GHS'
  GIP: 'GIP'
  GMD: 'GMD'
  GNF: 'GNF'
  GTQ: 'GTQ'
  GYD: 'GYD'
  HKD: 'HKD'
  HNL: 'HNL'
  HRK: 'HRK'
  HTG: 'HTG'
  HUF: 'HUF'
  IDR: 'IDR'
  ILS: 'ILS'
  INR: 'INR'
  IQD: 'IQD'
  ISK: 'ISK'
  JMD: 'JMD'
  JOD: 'JOD'
  JPY: 'JPY'
  KES: 'KES'
  KGS: 'KGS'
  KHR: 'KHR'
  KMF: 'KMF'
  KRW: 'KRW'
  KWD: 'KWD'
  KYD: 'KYD'
  KZT: 'KZT'
  LAK: 'LAK'
  LKR: 'LKR'
  LRD: 'LRD'
  LSL: 'LSL'
  MAD: 'MAD'
  MDL: 'MDL'
  MGA: 'MGA'
  MKD: 'MKD'
  MMK: 'MMK'
  MNT: 'MNT'
  MOP: 'MOP'
  MUR: 'MUR'
  MVR: 'MVR'
  MWK: 'MWK'
  MXN: 'MXN'
  MYR: 'MYR'
  MZN: 'MZN'
  NAD: 'NAD'
  NGN: 'NGN'
  NIO: 'NIO'
  NOK: 'NOK'
  NPR: 'NPR'
  NZD: 'NZD'
  OMR: 'OMR'
  PEN: 'PEN'
  PGK: 'PGK'
  PHP: 'PHP'
  PKR: 'PKR'
  PLN: 'PLN'
  PYG: 'PYG'
  QAR: 'QAR'
  RON: 'RON'
  RSD: 'RSD'
  RUB: 'RUB'
  RWF: 'RWF'
  SAR: 'SAR'
  SCR: 'SCR'
  SEK: 'SEK'
  SGD: 'SGD'
  SLL: 'SLL'
  SOS: 'SOS'
  SVC: 'SVC'
  SZL: 'SZL'
  THB: 'THB'
  TND: 'TND'
  TRY: 'TRY'
  TTD: 'TTD'
  TWD: 'TWD'
  TZS: 'TZS'
  UAH: 'UAH'
  UGX: 'UGX'
  USD: 'USD'
  UYU: 'UYU'
  UZS: 'UZS'
  VND: 'VND'
  VUV: 'VUV'
  XAF: 'XAF'
  XCD: 'XCD'
  XOF: 'XOF'
  XPF: 'XPF'
  YER: 'YER'
  ZAR: 'ZAR'
  ZMW: 'ZMW'
}>
export const razorpayCurrencyCodeSchema: RazorpayCurrencyCodeZodSchema = z.enum(
  RAZORPAY_CURRENCY_CODES,
)

/**
 * Type that represents a Razorpay currency code.
 *
 * @see https://razorpay.com/docs/payments/international-payments#supported-currencies
 */
export type RazorpayCurrencyCode = z.infer<typeof razorpayCurrencyCodeSchema>

type UnknownNotesZodSchema = z.ZodUnknown
/**
 * Using `z.unkown()` here, instead of `z.record(z.string(), z.string())`
 * because of a Razorpay quirk where an empty array `[]` is returned when there are no notes passed.
 */
export const unknownNotesSchema: UnknownNotesZodSchema = z.unknown()

export type RazorpayCredentialsZodSchema = z.ZodObject<{
  id: z.ZodString
  secret: z.ZodString
}, z.core.$strip>
/**
 * Zod schema that validates Razorpay credentials.
 *
 * @see https://razorpay.com/docs/api/credentials
 */
export const razorpayCredentialsSchema: RazorpayCredentialsZodSchema = z.object({
  id: z.string(),
  secret: z.string(),
})

/**
 * Type that represents Razorpay credentials.
 *
 * @see https://razorpay.com/docs/api/credentials
 */
export type RazorpayCredentials = z.infer<typeof razorpayCredentialsSchema>

/**
 * Returns the headers for a Razorpay request.
 *
 * @param credentials - The Razorpay credentials.
 * @returns The headers for a Razorpay request.
 */
export function getRazorpayRequestHeaders(
  { id, secret }: RazorpayCredentials,
): Record<string, string> {
  return {
    'Authorization': 'Basic' + _btoa(`${id}:${secret}`),
    'Content-Type': 'application/json',
  }
}

/**
 * Converts an amount to subunits.
 *
 * @param amount - The amount to convert.
 * @param currency - The currency of the amount.
 * @returns The amount in subunits.
 */
export function convertAmountToSubunits(amount: number, currency: RazorpayCurrencyCode): number {
  return Math.round(amount * Math.pow(10, RAZORPAY_CURRENCIES[currency]?.exponent ?? 2))
}

/**
 * Converts a string to a base64 encoded string.
 *
 * @param str - The string to convert.
 * @returns The base64 encoded string.
 */
function _btoa(str: string): string {
  return Buffer.from(str).toString('base64')
}
