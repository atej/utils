import type { RequireExactlyOne } from 'type-fest'
import { attemptAsync } from './attempt-async.ts'

type ResponseParser = (response: Response) => Promise<unknown>
const DEFAULT_RESPONSE_OPTIONS = {
  parser: async (response: Response) => await response.json(),
} as const satisfies ResponseOptions

/**
 * Attempts to fetch a resource and returns a promise that resolves to a fetch result.
 *
 * @param input - The input to fetch.
 * @param fetchOptions - The options to pass to the fetch function.
 * @param responseOptions - The options to handle the response.
 *
 * @returns A promise that resolves to an error or response data. If data is present, it's type (success or fail)
 *  can be narrowed down using the `ok` property.
 *
 * @example
 * ```ts
 * const { error, ok, statusCode, data } = await attemptFetch<Success, Failure>('https://api.example.com/resource')
 *
 * if (error) {
 *   console.error(error) // FetchError
 * } else  {
 *   console.log(data.status) // http status of the response
 *   if (!ok) {
 *     console.log(data.body) // parsed response body of type Failure
 *   } else {
 *     console.log(data.body) // parsed response body of type Success
 *   }
 * }
 * ```
 */
export async function attemptFetch<
  Success extends unknown = unknown,
  Failure extends unknown = unknown,
>(
  input: Parameters<typeof fetch>[0],
  fetchOptions?: Parameters<typeof fetch>[1],
  responseOptions?: ResponseOptions,
): Promise<FetchResult<Success, Failure>> {
  const { data: response, error } = await attemptAsync(async () => {
    const response = await fetch(input, fetchOptions)
    return response
  })

  if (error) {
    return {
      error: error instanceof Error
        ? new FetchError(`Failed to fetch ${String(input)}: ${error.message}`)
        : new FetchError(`Failed to fetch ${String(input)}: ${String(error)}`),
      data: undefined,
    }
  }

  const failureParser = responseOptions?.parsers?.failure ?? responseOptions?.parser ??
    DEFAULT_RESPONSE_OPTIONS.parser
  const successParser = responseOptions?.parsers?.success ?? responseOptions?.parser ??
    DEFAULT_RESPONSE_OPTIONS.parser

  if (!response.ok) {
    return {
      error: undefined,
      data: {
        ok: false,
        status: response.status,
        body: await failureParser(response) as Failure,
      },
    }
  }

  return {
    error: undefined,
    data: {
      ok: true,
      status: response.status,
      body: await successParser(response) as Success,
    },
  }
}

type ResponseOptions = RequireExactlyOne<{
  parser: ResponseParser
  parsers: Partial<{
    success: ResponseParser
    failure: ResponseParser
  }>
}>

/**
 * The result of an attempt to fetch a resource.
 */
export type FetchResult<
  Success extends unknown = unknown,
  Failure extends unknown = unknown,
> = {
  error: FetchError
  data: undefined
} | {
  error: undefined
  data: {
    ok: false
    body: Failure
    status: number
  }
} | {
  error: undefined
  data: {
    ok: true
    body: Success
    status: number
  }
}

class FetchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FetchError'
  }
}
