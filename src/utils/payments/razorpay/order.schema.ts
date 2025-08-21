import { z } from 'zod/v4'
import {
  razorpayCurrencyCodeSchema,
  type RazorpayCurrencyCodeZodSchema,
  unknownNotesSchema,
} from './helpers.ts'

type SchemaType = z.ZodObject<{
  id: z.ZodString
  entity: z.ZodLiteral<'order'>
  created_at: z.ZodNumber
  attempts: z.ZodNumber
  amount: z.ZodNumber
  amount_due: z.ZodNumber
  amount_paid: z.ZodNumber
  currency: RazorpayCurrencyCodeZodSchema
  status: z.ZodEnum<{
    created: 'created'
    attempted: 'attempted'
    paid: 'paid'
  }>
  receipt: z.ZodOptional<z.ZodNullable<z.ZodString>>
  offer_id: z.ZodOptional<z.ZodNullable<z.ZodString>>
  offers: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>
  notes: z.ZodOptional<z.ZodNullable<z.ZodUnknown>>
}, z.core.$strip>

/**
 * Zod schema that validates a Razorpay order entity.
 *
 * @see https://razorpay.com/docs/api/orders/entity
 */
export const razorpayOrderSchema: SchemaType = z.object({
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
  notes: unknownNotesSchema.nullish(),
})

/**
 * Type that represents a Razorpay order entity.
 *
 * @see https://razorpay.com/docs/api/orders/entity
 */
export type RazorpayOrder = z.infer<typeof razorpayOrderSchema>
