import { joinTruthy } from './join-truthy'

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

export function formatAddress(address: Address, options?: FormatAddressOptions) {
  const { multiLine } = { ...DEFAULT_FORMAT_ADDRESS_OPTIONS, ...options }

  const { street, city, region, postalCode, country } = address

  const segment1 = street
  const segment2 = joinTruthy([joinTruthy([city, region], ', '), postalCode], ' ')
  const segment3 = country

  return multiLine
    ? joinTruthy([segment1, segment2, segment3], '\n')
    : joinTruthy([segment1, segment2, segment3], ', ')
}
