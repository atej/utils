/**
 * This module contains utilities for Cloudflare.
 *
 * These utilities take a incoming request's Cloudflare properties as an argument,
 * so are meant to be used server-side.
 *
 * @module
 */

export {
  type CfContinentCode,
  type CfCountryCode,
  type CfCountryCodeWithTor,
  type CfRequestGeoData,
  getCfRequestGeoData,
} from './get-cf-request-geo-data.ts'
