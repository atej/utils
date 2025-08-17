import { z } from 'zod/v4'
import { RAZORPAY_CURRENCY_CODES } from './data.ts'

/**
 * Zod schema that validates a Razorpay currency code.
 *
 * @see https://razorpay.com/docs/payments/international-payments#supported-currencies
 */
export const razorpayCurrencyCodeSchema = z.enum(RAZORPAY_CURRENCY_CODES)

/**
 * Zod schema that validates a Razorpay order entity.
 *
 * @see https://razorpay.com/docs/api/orders/entity
 */
export const razorpayOrderSchema = z.object({
  id: z.string(),
  entity: z.literal('order'),
  created_at: z.number(),
  attempts: z.number(),
  amount: z.number(),
  amount_due: z.number(),
  amount_paid: z.number(),
  currency: razorpayCurrencyCodeSchema,
  status: z.string(),
  receipt: z.string().nullish(),
  offer_id: z.string().nullish(),
  offers: z.array(z.string()).nullish(),
  notes: z.unknown().nullish(),
})
