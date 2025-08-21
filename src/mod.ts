// Arrays
export { joinTruthy } from './utils/arrays/join-truthy.ts'

// Objects
export { omitNullish } from './utils/objects/omit-nullish.ts'

// Functions
export { attemptAsync } from './utils/functions/attempt-async.ts'
export { attemptFetch, type FetchResult } from './utils/functions/attempt-fetch.ts'
export { attempt } from './utils/functions/attempt.ts'

// JSON
export { getJsonUtil, json, jsonc } from './utils/json/json.ts'

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
export { getUserLang } from './utils/web/get-user-lang.ts'
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
