import { z } from 'zod/v4'
import { _unknownNotesSchema, razorpayCurrencyCodeSchema } from './helpers.ts'

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
  status: z.enum(['created', 'attempted', 'paid']),

  // May not be present or may be null
  receipt: z.string().nullish(),
  offer_id: z.string().nullish(),
  offers: z.array(z.string()).nullish(),
  notes: _unknownNotesSchema.nullish(),
})

/**
 * Type that represents a Razorpay order entity.
 *
 * @see https://razorpay.com/docs/api/orders/entity
 */
export type RazorpayOrder = z.infer<typeof razorpayOrderSchema>
