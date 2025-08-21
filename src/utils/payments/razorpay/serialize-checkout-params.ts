import { jsonc } from '../../json/json.ts'
import type { Result } from '../../types/result.ts'
import type { RazorpayCheckoutParams } from './checkout-params.schema.ts'

type Serializer = (options: RazorpayCheckoutParams) => Result<string>
type Deserializer = (options: string) => Result<RazorpayCheckoutParams>

const stringify = jsonc().stringify
const parse = jsonc<RazorpayCheckoutParams>().parse

function defaultSerializer(options: RazorpayCheckoutParams): Result<string> {
  return stringify(options)
}

function defaultDeserializer(options: string): Result<RazorpayCheckoutParams> {
  return parse(options)
}

/**
 * Serialize Razorpay checkout params.
 */
export function serializeRazorpayCheckoutParams(
  input: RazorpayCheckoutParams,
  serializeOptions?: { serializer?: Serializer },
): Result<string> {
  const serializer = serializeOptions?.serializer ?? defaultSerializer
  return serializer(input)
}

export function deserializeRazorpayCheckoutParams(
  input: string,
  deserializeOptions?: { deserializer?: Deserializer },
): Result<RazorpayCheckoutParams> {
  const deserializer = deserializeOptions?.deserializer ?? defaultDeserializer
  return deserializer(input)
}
