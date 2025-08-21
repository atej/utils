import type { MergeDeep } from 'type-fest'
import z from 'zod/v4'
import { attemptFetch, type FetchResult } from '../../functions/attempt-fetch.ts'
import { omitNullish } from '../../objects/omit-nullish.ts'
import {
  convertAmountToSubunits,
  getRazorpayRequestHeaders,
  razorpayCredentialsSchema,
  type RazorpayCredentialsZodSchema,
  type RazorpayCurrencyCode,
  razorpayCurrencyCodeSchema,
  type RazorpayCurrencyCodeZodSchema,
} from './helpers.ts'
import type { RazorpayOrder } from './order.schema.ts'

type CreateRazorpayOrderParamsZodSchema = z.ZodObject<{
  credentials: RazorpayCredentialsZodSchema
  order: z.ZodObject<{
    amount: z.ZodNumber
    currency: RazorpayCurrencyCodeZodSchema
    notes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>
    receipt: z.ZodOptional<z.ZodString>
    partialPayment: z.ZodOptional<z.ZodBoolean>
    firstPaymentMinAmount: z.ZodOptional<z.ZodNumber>
  }, z.core.$strip>
}, z.core.$strip>

/**
 * Zod schema that validates the parameters for `createRazorpayOrder`.
 */
export const createRazorpayOrderParamsSchema: CreateRazorpayOrderParamsZodSchema = z.object({
  credentials: razorpayCredentialsSchema,
  order: z.object({
    amount: z.number(),
    currency: razorpayCurrencyCodeSchema,
    notes: z.record(z.string(), z.string()).optional(),
    receipt: z.string().optional(),
    partialPayment: z.boolean().optional(),
    firstPaymentMinAmount: z.number().optional(),
  }),
})

/**
 * Type that represents the parameters for `createRazorpayOrder`.
 * An optional type parameter can be passed to constrain the type of `notes.
 *
 * @see https://razorpay.com/docs/api/orders/create
 */
export type CreateRazorpayOrderParams<
  TNotes extends Record<string, string> = Record<string, string>,
> = MergeDeep<z.infer<typeof createRazorpayOrderParamsSchema>, { order: { notes: TNotes } }>

/**
 * Create a Razorpay order. An optional type parameter can be passed to constrain the type of `notes`.
 */
export async function createRazorpayOrder<
  TNotes extends Record<string, string> = Record<string, string>,
>({
  credentials,
  order,
}: CreateRazorpayOrderParams<TNotes>): Promise<
  FetchResult<SuccessResponseBody, FailureResponseBody>
> {
  const headers = getRazorpayRequestHeaders(credentials)
  const body = omitNullish({
    amount: convertAmountToSubunits(order.amount, order.currency),
    currency: order.currency,
    notes: order.notes,
    receipt: order.receipt,
    partial_payment: order.partialPayment,
    first_payment_min_amount: order.firstPaymentMinAmount,
  }) satisfies RequestBody

  return await attemptFetch<SuccessResponseBody, FailureResponseBody>(
    'https://api.razorpay.com/v1/orders',
    {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    },
  )
}

/////////////////////////////////////
// #region Razorpay API Reference ///
/////////////////////////////////////

/**
 * Body of the request to create a Razorpay order.
 *
 * @see https://razorpay.com/docs/api/orders/create
 */
type RequestBody = {
  amount: number
  currency: RazorpayCurrencyCode
  notes: Record<string, string>
  receipt: string
  partial_payment: boolean
  first_payment_min_amount: number
}

/**
 * Body of the response if the request is successful.
 *
 * @see https://razorpay.com/docs/api/orders/create
 */
type SuccessResponseBody = RazorpayOrder & { error: undefined }

/**
 * Body of the response if the request failed.
 *
 * @see https://razorpay.com/docs/api/orders/create
 */
type FailureResponseBody = { error: { code: string; description: string } }

/////////////////////////////////////
// #endregion ///////////////////////
/////////////////////////////////////
