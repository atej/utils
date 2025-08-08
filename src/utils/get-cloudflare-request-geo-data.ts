import type {
  IncomingRequestCfProperties,
  IncomingRequestCfPropertiesGeographicInformation,
} from '@cloudflare/workers-types'

/**
 * An object containing the geographic data about the origin of an incoming request to a Cloudflare worker
 */
export type CloudflareRequestGeoData = IncomingRequestCfPropertiesGeographicInformation

/**
 * Get the geographic data about the origin of an incoming request to a Cloudflare worker
 * @param cf - Incoming request properties
 * @returns An object containing the geographic data
 */
export function getCloudflareRequestGeoData(
  cf: IncomingRequestCfProperties,
): CloudflareRequestGeoData {
  return {
    ...(cf.country ? { country: cf.country } : {}),
    ...(cf.isEUCountry ? { isEUCountry: cf.isEUCountry } : {}),
    ...(cf.continent ? { continent: cf.continent } : {}),
    ...(cf.city ? { city: cf.city } : {}),
    ...(cf.postalCode ? { postalCode: cf.postalCode } : {}),
    ...(cf.latitude ? { latitude: cf.latitude } : {}),
    ...(cf.longitude ? { longitude: cf.longitude } : {}),
    ...(cf.timezone ? { timezone: cf.timezone } : {}),
    ...(cf.region ? { region: cf.region } : {}),
    ...(cf.regionCode ? { regionCode: cf.regionCode } : {}),
    ...(cf.metroCode ? { metroCode: cf.metroCode } : {}),
  }
}
