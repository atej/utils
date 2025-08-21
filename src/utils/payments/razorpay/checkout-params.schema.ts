import z from 'zod/v4'
import { RAZORPAY_CHECKOUT_LANGS } from './data.ts'
import { razorpayCurrencyCodeSchema, type RazorpayCurrencyCodeZodSchema } from './helpers.ts'

type RazorpayCheckoutParamsZodSchema = z.ZodObject<{
  key: z.ZodString
  amount: z.ZodNumber
  currency: RazorpayCurrencyCodeZodSchema
  orderId: z.ZodString
  businessName: z.ZodString
  onSuccess: z.ZodOptional<z.ZodUnknown>
  callbackUrl: z.ZodOptional<z.ZodURL>
  redirectOnFailure: z.ZodOptional<z.ZodBoolean>
  description: z.ZodOptional<z.ZodString>
  notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>
  logoImage: z.ZodOptional<z.ZodString>
  prefill: z.ZodOptional<
    z.ZodObject<{
      name: z.ZodOptional<z.ZodString>
      email: z.ZodOptional<z.ZodString>
      phoneWithPhoneCode: z.ZodOptional<z.ZodString>
      method: z.ZodOptional<
        z.ZodEnum<{
          card: 'card'
          upi: 'upi'
          netbanking: 'netbanking'
          wallet: 'wallet'
          emi: 'emi'
        }>
      >
    }, z.core.$strip>
  >
  readonly: z.ZodOptional<
    z.ZodObject<{
      name: z.ZodOptional<z.ZodBoolean>
      email: z.ZodOptional<z.ZodBoolean>
      phoneWithPhoneCode: z.ZodOptional<z.ZodBoolean>
    }, z.core.$strip>
  >
  hidden: z.ZodOptional<
    z.ZodObject<{
      email: z.ZodOptional<z.ZodBoolean>
      phoneWithPhoneCode: z.ZodOptional<z.ZodBoolean>
    }, z.core.$strip>
  >
  theme: z.ZodOptional<
    z.ZodObject<{
      color: z.ZodOptional<z.ZodString>
      backdropColor: z.ZodOptional<z.ZodString>
    }, z.core.$strip>
  >
  modal: z.ZodOptional<
    z.ZodObject<{
      onDismiss: z.ZodOptional<z.ZodUnknown>
      confirmClose: z.ZodOptional<z.ZodBoolean>
      animateOpening: z.ZodOptional<z.ZodBoolean>
      closeOnBackdropClick: z.ZodOptional<z.ZodBoolean>
      closeOnEscape: z.ZodOptional<z.ZodBoolean>
      closeOnBrowserBack: z.ZodOptional<z.ZodBoolean>
    }, z.core.$strip>
  >
  recurring: z.ZodOptional<z.ZodBoolean>
  subscriptionId: z.ZodOptional<z.ZodString>
  allowSubscriptionCardChange: z.ZodOptional<z.ZodBoolean>
  customerId: z.ZodOptional<z.ZodString>
  rememberCustomer: z.ZodOptional<z.ZodBoolean>
  timeout: z.ZodOptional<z.ZodNumber>
  sendSmsHash: z.ZodOptional<z.ZodBoolean>
  allowRotation: z.ZodOptional<z.ZodBoolean>
  retry: z.ZodOptional<
    z.ZodObject<{
      enabled: z.ZodOptional<z.ZodBoolean>
      maxCount: z.ZodOptional<z.ZodNumber>
    }, z.core.$strip>
  >
  config: z.ZodOptional<
    z.ZodObject<{
      display: z.ZodOptional<
        z.ZodObject<{
          language: z.ZodOptional<
            z.ZodEnum<{
              en: 'en'
              ben: 'ben'
              hi: 'hi'
              mar: 'mar'
              guj: 'guj'
              tam: 'tam'
              tel: 'tel'
            }>
          >
        }, z.core.$strip>
      >
    }, z.core.$strip>
  >
}, z.core.$strip>

/**
 * Zod schema that validates the parameters for the `openRazorpayCheckout` function.
 */
export const razorpayCheckoutParamsSchema: RazorpayCheckoutParamsZodSchema = z.object({
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

/**
 * Type that represents the parameters for the `openRazorpayCheckout` function.
 */
export type RazorpayCheckoutParams = z.infer<typeof razorpayCheckoutParamsSchema>
