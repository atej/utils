import type { MergeDeep } from 'type-fest'
import { z } from 'zod/v4'
import { RAZORPAY_CHECKOUT_LANGS } from './data.ts'
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

/**
 * Zod schema that validates a Razorpay checkout options object.
 *
 * @see https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/#123-checkout-options
 */
export const razorpayCheckoutOptionsSchema = z.object({
  key: z.string(),
  amount: z.number(),
  currency: razorpayCurrencyCodeSchema,
  order_id: z.string(),
  name: z.string(), // name of the business NOT the name of the customer e.g. Acme Corp

  // Optional
  notes: _unknownNotesSchema.optional(),
  callback_url: z.url().optional(),
  description: z.string().optional(),
  image: z.string().optional(), // url or base64 encoded data uri of the logo
  prefill: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    contact: z.string().optional(),
    method: z.enum(['card', 'upi', 'netbanking', 'wallet', 'emi']).optional(),
  }).optional(),
  readonly: z.object({
    email: z.boolean().optional(),
    contact: z.boolean().optional(),
    name: z.boolean().optional(),
  }).optional(),
  hidden: z.object({
    email: z.boolean().optional(),
    contact: z.boolean().optional(),
  }).optional(),
  theme: z.object({
    color: z.string().optional(),
    backdrop_color: z.string().optional(),
  }).optional(),
  modal: z.object({
    ondismiss: z.unknown().optional(),
    backdropclose: z.boolean().optional(), // default is false
    escape: z.boolean().optional(), // default is true
    handleback: z.boolean().optional(), // default is true
    confirm_close: z.boolean().optional(), // default is false
    animation: z.boolean().optional(), // default is true
  }).optional(),
  subscription_id: z.string().optional(),
  subscription_card_change: z.boolean().optional(),
  recurring: z.boolean().optional(),
  redirect: z.boolean().optional(), // post payment failure, redirect to `callback_url` if true, or show checkout modal to retry next best option if false (default)
  customer_id: z.string().optional(),
  remember_customer: z.boolean().optional(),
  timeout: z.number().optional(),
  send_sms_hash: z.boolean().optional(),
  allow_rotation: z.boolean().optional(),
  retry: z.object({
    enabled: z.boolean().optional(), // default is true
    max_count: z.number().optional(), // web integration does not support this
  }).optional(),
  config: z.object({
    display: z.object({
      language: z.enum(RAZORPAY_CHECKOUT_LANGS).optional(),
    }).optional(),
  }).optional(),
})

/**
 * Type that represents a Razorpay checkout options object.
 *
 * @see https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/#123-checkout-options
 */
export type RazorpayCheckoutOptions<
  TNotes extends Record<string, string> = Record<string, string>,
> = MergeDeep<z.infer<typeof razorpayCheckoutOptionsSchema>, { notes: TNotes }>
