import type { MergeDeep } from 'type-fest'
import z from 'zod/v4'
import { attemptFetch, type FetchResult } from '../functions/attempt-fetch.ts'
import {
  _unknownNotesSchema,
  convertAmountToSubunits,
  getRazorpayRequestHeaders,
  razorpayCredentialsSchema,
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
  }),
})

/**
 * Type that represents the parameters for `createRazorpayOrder`. An optional type parameter
 * can be passed to constrain the type of `notes.
 *
 * @see https://razorpay.com/docs/api/orders/create
 */
export type CreateRazorpayOrderParams<
  TNotes extends Record<string, string> = Record<string, string>,
> = MergeDeep<z.infer<typeof createRazorpayOrderParamsSchema>, { order: { notes: TNotes } }>

/**
 * Create a Razorpay order. An optional type parameter can be passed to constrain the type of `notes`.
 *
 * @see https://razorpay.com/docs/api/orders/create
 */
export async function createRazorpayOrder<
  TNotes extends Record<string, string> = Record<string, string>,
>({
  credentials,
  order,
}: CreateRazorpayOrderParams<TNotes>): Promise<
  FetchResult<CreateOrderSuccess, CreateOrderFailure>
> {
  return await attemptFetch<CreateOrderSuccess, CreateOrderFailure>(
    'https://api.razorpay.com/v1/orders',
    {
      method: 'POST',
      headers: getRazorpayRequestHeaders(credentials),
      body: JSON.stringify({
        amount: convertAmountToSubunits(order.amount, order.currency),
        currency: order.currency,
        notes: order.notes,
      }),
    },
  )
}

type CreateOrderSuccess = RazorpayOrder & { error: undefined }
type CreateOrderFailure = { error: { code: string; description: string } }
