import { Buffer } from 'node:buffer'
import z from 'zod/v4'
import { RAZORPAY_CURRENCIES, RAZORPAY_CURRENCY_CODES } from './data.ts'

/**
 * Zod schema that validates a Razorpay currency code.
 *
 * @see https://razorpay.com/docs/payments/international-payments#supported-currencies
 */
export const razorpayCurrencyCodeSchema = z.enum(RAZORPAY_CURRENCY_CODES)

/**
 * Type that represents a Razorpay currency code.
 *
 * @see https://razorpay.com/docs/payments/international-payments#supported-currencies
 */
export type RazorpayCurrencyCode = z.infer<typeof razorpayCurrencyCodeSchema>

/**
 * Using `z.unkown()` here, instead of `z.record(z.string(), z.string())`
 * because of a Razorpay quirk where an empty array `[]` is returned when there are no notes passed.
 */
export const _unknownNotesSchema = z.unknown()

/**
 * Zod schema that validates Razorpay credentials.
 *
 * @see https://razorpay.com/docs/api/credentials
 */
export const razorpayCredentialsSchema = z.object({
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
  return Math.round(amount * Math.pow(10, RAZORPAY_CURRENCIES[currency].exponent))
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
