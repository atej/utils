import { jsonc } from '../json/json.ts'
import type { Result } from '../types/result.ts'
import type { RazorpayCheckoutOptions } from './schemas.ts'

type Serializer = (options: RazorpayCheckoutOptions) => Result<string>

function defaultSerializer(options: RazorpayCheckoutOptions): Result<string> {
  return jsonc.stringify(options)
}

export function serializeCheckoutOptions(
  input: RazorpayCheckoutOptions,
  serializeOptions?: { serializer?: Serializer },
): Result<string> {
  const serializer = serializeOptions?.serializer ?? defaultSerializer
  return serializer(input)
}
