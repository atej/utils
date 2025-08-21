import type { MergeDeep } from 'type-fest'
import z from 'zod/v4'
import { attemptFetch, type FetchResult } from '../../functions/attempt-fetch.ts'
import { omitNullish } from '../../objects/omit-nullish.ts'
import {
  _unknownNotesSchema,
  convertAmountToSubunits,
  getRazorpayRequestHeaders,
  razorpayCredentialsSchema,
  type RazorpayCurrencyCode,
  razorpayCurrencyCodeSchema,
} from './helpers.ts'
import type { RazorpayOrder } from './schemas.ts'

/**
 * Zod schema that validates the parameters for `createRazorpayOrder`.
 */
export const createRazorpayOrderParamsSchema = z.object({
  credentials: razorpayCredentialsSchema,
  order: z.object({
    amount: z.number(),
    currency: razorpayCurrencyCodeSchema,
    notes: _unknownNotesSchema.optional(),
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
