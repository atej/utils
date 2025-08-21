import z from 'zod/v4'
import { RAZORPAY_CHECKOUT_LANGS } from './data.ts'
import { razorpayCurrencyCodeSchema } from './helpers.ts'

export const razorpayCheckoutParamsSchema = z.object({
  key: z.string(),
  amount: z.number(),
  currency: razorpayCurrencyCodeSchema,
  orderId: z.string(),
  businessName: z.string(),

  // Optional
  /**
   * Function to be called when the payment is successful. Use this or the `callbackUrl` to handle successful payments.
   */
  onSuccess: z.unknown().optional(),
  callbackUrl: z.url().optional(),
  /**
   * Requires `callbackUrl` to be set. By default, on payment failure, the checkout modal is shown to retry with next best option.
   * If this is set to true, on payment failure, the user will be redirected with a post request to the callback url.
   *
   * @default false
   */
  redirectOnFailure: z.boolean().optional(),
  description: z.string().optional(),
  notes: z.record(z.string(), z.string()).optional(),
  /**
   * URL or Base64 encoded data URI of the logo.
   */
  logoImage: z.string().optional(),
  prefill: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phoneWithPhoneCode: z.string().optional(),
    method: z.enum(['card', 'upi', 'netbanking', 'wallet', 'emi']).optional(),
  }).optional(),
  readonly: z.object({
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    phoneWithPhoneCode: z.boolean().optional(),
  }).optional(),
  hidden: z.object({
    email: z.boolean().optional(),
    phoneWithPhoneCode: z.boolean().optional(),
  }).optional(),
  theme: z.object({
    color: z.string().optional(),
    backdropColor: z.string().optional(),
  }).optional(),
  modal: z.object({
    onDismiss: z.unknown().optional(),
    confirmClose: z.boolean().optional(), // default is false
    animateOpening: z.boolean().optional(), // default is true
    closeOnBackdropClick: z.boolean().optional(), // default is false
    closeOnEscape: z.boolean().optional(), // default is true
    closeOnBrowserBack: z.boolean().optional(), // default is true
  }).optional(),
  recurring: z.boolean().optional(),
  subscriptionId: z.string().optional(),
  allowSubscriptionCardChange: z.boolean().optional(),
  customerId: z.string().optional(),
  rememberCustomer: z.boolean().optional(),
  timeout: z.number().optional(),
  sendSmsHash: z.boolean().optional(),
  allowRotation: z.boolean().optional(),
  retry: z.object({
    enabled: z.boolean().optional(), // default is true
    maxCount: z.number().optional(), // web integration does not support this
  }).optional(),
  config: z.object({
    display: z.object({
      language: z.enum(RAZORPAY_CHECKOUT_LANGS).optional(),
    }).optional(),
  }).optional(),
})

export type RazorpayCheckoutParams = z.infer<typeof razorpayCheckoutParamsSchema>
