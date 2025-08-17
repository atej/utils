// Arrays
export { joinTruthy } from './utils/arrays/join-truthy.ts'

// Functions
export { attemptAsync } from './utils/functions/attempt-async.ts'
export { attemptFetch, type FetchResult } from './utils/functions/attempt-fetch.ts'
export { attempt } from './utils/functions/attempt.ts'

// Parsers
export { parseNumber } from './utils/parsers/parse-number.ts'

// Formatters
export { type Address, formatAddress } from './utils/formatters/format-address.ts'
export { formatCurrencyInWords } from './utils/formatters/format-currency-in-words.ts'
export { formatCurrency } from './utils/formatters/format-currency.ts'
export {
  formatNumberInWords,
  type NumberInWordsOptions,
} from './utils/formatters/format-number-in-words.ts'

// Web
export {
  buildQuerystring,
  keepInQuerystring,
  omitFromQuerystring,
  parseQuerystring,
  type SearchParamsOptions,
} from './utils/web/querystring.ts'
export {
  CLIENT_ERROR_STATUS,
  REDIRECT_STATUS,
  SERVER_ERROR_STATUS,
  STATUS,
  SUCCESS_STATUS,
} from './utils/web/status-codes.ts'

// Types
export type { Equal } from './types/equal.ts'
export type { Expect } from './types/expect.ts'
export type { JsonObject } from './types/json-object.ts'
export type { ParseResult } from './types/parse-result.ts'
export type { Result } from './types/result.ts'
