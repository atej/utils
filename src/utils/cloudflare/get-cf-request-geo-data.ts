import type {
  IncomingRequestCfProperties,
  IncomingRequestCfPropertiesGeographicInformation,
} from '@cloudflare/workers-types'
import type { Simplify } from 'type-fest'

/**
 * A two-letter continent code.
 */
export type CfContinentCode = Simplify<
  NonNullable<IncomingRequestCfPropertiesGeographicInformation['continent']>
>

/**
 * An ISO 3166-1 Alpha 2 country code or `T1` for TOR connections.
 */
export type CfCountryCodeWithTor = Simplify<
  NonNullable<IncomingRequestCfPropertiesGeographicInformation['country']>
>

/**
 * An ISO 3166-1 Alpha 2 country code.
 */
export type CfCountryCode = Exclude<CfCountryCodeWithTor, 'T1'>

/**
 * An object containing the geographic data about the origin of an incoming request to a Cloudflare worker.
 */
export type CfRequestGeoData =
  & Omit<
    IncomingRequestCfPropertiesGeographicInformation,
    'country' | 'continent'
  >
  & {
    countryCode?: CfCountryCodeWithTor
    continentCode?: CfContinentCode
  }

/**
 * Get the geographic data about the origin of an incoming request to a Cloudflare worker.
 * @param cf - Incoming request properties
 * @returns An object containing the geographic data
 */
export function getCfRequestGeoData(
  cf: IncomingRequestCfProperties,
): CfRequestGeoData {
  return {
    ...(cf.continent ? { continentCode: cf.continent } : {}),
    ...(cf.country ? { countryCode: cf.country } : {}),
    ...(cf.regionCode ? { regionCode: cf.regionCode } : {}),
    ...(cf.postalCode ? { postalCode: cf.postalCode } : {}),
    ...(cf.region ? { region: cf.region } : {}),
    ...(cf.city ? { city: cf.city } : {}),
    ...(cf.timezone ? { timezone: cf.timezone } : {}),
    ...(cf.latitude ? { latitude: cf.latitude } : {}),
    ...(cf.longitude ? { longitude: cf.longitude } : {}),
    ...(cf.metroCode ? { metroCode: cf.metroCode } : {}),
    ...(cf.isEUCountry ? { isEUCountry: cf.isEUCountry } : {}),
  }
}
