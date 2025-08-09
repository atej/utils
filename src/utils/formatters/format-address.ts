import { joinTruthy } from './join-truthy.ts'

/**
 * An address object.
 *
 * @property street - The street address.
 * @property city - The city.
 * @property region - The state/region.
 * @property postalCode - The postal code.
 * @property country - The country.
 */
export type Address = {
  street?: string | null
  city?: string | null
  region?: string | null
  postalCode?: string | null
  country?: string | null
}

type FormatAddressOptions = {
  multiLine?: boolean
}

const DEFAULT_FORMAT_ADDRESS_OPTIONS: FormatAddressOptions = {
  multiLine: false,
}

/**
 * Format an address object into a string.
 *
 * @param address - The address object to format.
 * @param options - The options for formatting the address.
 * @returns The formatted address string.
 */
export function formatAddress(address: Address, options?: FormatAddressOptions): string {
  const { multiLine } = { ...DEFAULT_FORMAT_ADDRESS_OPTIONS, ...options }

  const { street, city, region, postalCode, country } = address

  const segment1 = street
  const segment2 = joinTruthy([joinTruthy([city, region], ', '), postalCode], ' ')
  const segment3 = country

  return multiLine
    ? joinTruthy([segment1, segment2, segment3], '\n')
    : joinTruthy([segment1, segment2, segment3], ', ')
}
