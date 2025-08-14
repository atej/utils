import { build, type IOptions, keep, omit, parse } from 'search-params'
import type { JsonObject } from '../../types/json-object.ts'
import type { Result } from '../../types/result.ts'
import { json as jsonUtil } from '../json/json.ts'

const json = jsonUtil({ compression: true })

/**
 * Specififies how differnet values are stringified and parsed
 *
 * @see https://github.com/troch/search-params?tab=readme-ov-file#options
 */
export type SearchParamsOptions = IOptions & {
  /**
   * The key which in turn indicates which of the other keys' values should be deserialized into objects.
   * For example, if `__o=cart`, is found in the querystring, the value of the key `cart` will be
   * attempted to be deserialized into an object.
   *
   * @default '__o'
   */
  objectIndicatorKey?: string
}

/**
 * Default options for search params stringification and parsing
 */
const DEFAULT_SEARCH_PARAMS_OPTIONS = {
  /**
   *  Specifies how arrays should be stringified
   * - 'none' (default): no brackets or indexes are added to query parameter names ('role=member&role=admin')
   * - 'brackets': brackets are added to query parameter names ('role[]=member&role[]=admin')
   * - 'index': brackets and indexes are added to query parameter names ('role[0]=member&role[1]=admin')
   */
  arrayFormat: 'none',
  /**
   * booleanFormat: specifies how boolean values are stringified and parsed
   * - 'none' (default): booleans are stringified to strings ('istrue=true&isfalse=false')
   * - 'empty-true': same as 'none' except true values are stringified without value ('istrue&isfalse=false'). If you choose this boolean format, make sure to change the value of 'nullFormat'.
   * - 'string': same as 'none' but 'true' and 'false' are parsed as booleans
   * - 'unicode': true and false are displayed with unicode characters, and parsed as booleans ('istrue=✓&isfalse=✗')
   */
  booleanFormat: 'string',
  /**
   * nullFormat: specifies how null values are stringified and parsed
   * - 'default' (default): null values are stringified without equal sign and value ('isnull')
   * - 'string': null values are stringified to 'null' ('isnull=null') and parsed as null values
   * - 'hidden': null values are not stringified
   */
  nullFormat: 'hidden',

  /**
   * Indicates which of the other keys' values should be deserialized into objects.
   */
  objectIndicatorKey: '__o',
} as const satisfies SearchParamsOptions

type SearchParamPrimitive = string | number | boolean | Date | null | undefined
type SearchParamValue = SearchParamPrimitive | Array<SearchParamPrimitive> | JsonObject
type SearchParams = { [key: string]: SearchParamValue }

/**
 * Build a querystring from an object of parameters.
 *
 * @param params - Parameters to build a querystring from.
 * @param options - Options for how values should be stringified and parsed.
 * @returns A querystring prefixed with a question mark (similar to how `window.location.search` or `URL.search` is formatted).
 */
export function buildQuerystring(
  params: SearchParams,
  options?: SearchParamsOptions,
): Result<string> {
  const mergedOptions = { ...DEFAULT_SEARCH_PARAMS_OPTIONS, ...options }

  const { objectIndicatorKey } = mergedOptions

  const entries = Object.entries(params)

  const transformedEntries: [string, SearchParamValue][] = []
  const objectIndicatorEntry: [string, string[]] = [objectIndicatorKey, []]

  for (const [key, value] of entries) {
    // transform arrays
    if (Array.isArray(value)) {
      const newValue = value.filter((item) => item !== null && item !== undefined)
      if (newValue.length > 0) {
        transformedEntries.push([key, newValue])
      }
    } // transform objects
    else if (typeof value === 'object' && value !== null) {
      const { data: stringified, error } = json.stringify(value)
      if (error) {
        return { data: undefined, error }
      } else {
        objectIndicatorEntry[1].push(key)
        transformedEntries.push([key, stringified])
      }
    } // other values pass through
    else {
      transformedEntries.push([key, value])
    }
  }

  transformedEntries.push(objectIndicatorEntry)

  // finally, filter out all `null`, `undefined`, and empty array values
  const finalEntries = transformedEntries.filter(([, value]) =>
    Array.isArray(value) ? value.length : value !== null && value !== undefined
  )

  const finalParams = Object.fromEntries(finalEntries)

  const querystring = build(finalParams, mergedOptions)
  return {
    data: querystring.startsWith('?') ? querystring : '?'.concat(querystring),
    error: undefined,
  }
}

/**
 * Parse a querystring into an object of parameters.
 *
 * @param querystring - The querystring to parse.
 * @param options - Options for how values should be stringified and parsed.
 * @returns An object of parameters.
 */
export function parseQuerystring(
  querystring: string,
  options?: SearchParamsOptions,
): Result<SearchParams> {
  const mergedOptions = { ...DEFAULT_SEARCH_PARAMS_OPTIONS, ...options }

  const { objectIndicatorKey } = mergedOptions

  const parsedParams = parse(querystring, mergedOptions)

  const params: SearchParams = { ...parsedParams }

  if (objectIndicatorKey in parsedParams) {
    const objectKeys = parsedParams[objectIndicatorKey] as string[]
    delete params[objectIndicatorKey]

    for (const key of objectKeys) {
      const value = parsedParams[key]
      if (typeof value !== 'string') {
        return { data: undefined, error: new Error(`Expected value of type string for key ${key}`) }
      }
      const { data: parsed, error } = json.parse(value)
      if (error) {
        return { data: undefined, error }
      } else {
        params[key] = parsed as JsonObject
      }
    }
  }

  return { data: params, error: undefined }
}

/**
 * Omit the specified parameters from the querystring.
 *
 * @param querystring - The querystring to omit parameters from.
 * @param paramsToOmit - The parameters to omit.
 * @param options - Options for how values should be stringified and parsed.
 * @returns A querystring with the specified parameters omitted.
 */
export function omitFromQuerystring(
  querystring: string,
  paramsToOmit: string[],
  options?: SearchParamsOptions,
): string {
  const mergedOptions = { ...DEFAULT_SEARCH_PARAMS_OPTIONS, ...options }
  return omit(removeLeadingQuestionMark(querystring), paramsToOmit, mergedOptions).querystring
}

/**
 * Keep only the specified parameters in the querystring.
 *
 * @param querystring - The querystring to keep parameters from.
 * @param paramsToKeep - The parameters to keep.
 * @param options - Options for how values should be stringified and parsed.
 * @returns A querystring with only the specified parameters.
 */
export function keepInQuerystring(
  querystring: string,
  paramsToKeep: string[],
  options?: SearchParamsOptions,
): string {
  const mergedOptions = { ...DEFAULT_SEARCH_PARAMS_OPTIONS, ...options }
  return keep(removeLeadingQuestionMark(querystring), paramsToKeep, mergedOptions).querystring
}

function removeLeadingQuestionMark(querystring: string) {
  return querystring.startsWith('?') ? querystring.slice(1) : querystring
}
