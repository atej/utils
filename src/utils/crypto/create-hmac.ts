import {
  type BinaryLike,
  type BinaryToTextEncoding,
  createHmac as nodeCreateHmac,
  type KeyObject,
} from 'node:crypto'

/**
 * Options that determine how the HMAC is computed e.g. algorithm and encoding
 */
export type CreateHmacOptions = {
  /**
   * The algorithm to use for computing the HMAC
   * @example 'sha256'
   */
  algorithm: string
  /**
   * The encoding to use for the HMAC
   * @example 'hex'
   */
  encoding: BinaryToTextEncoding
}

const DEFAULT_CREATE_HMAC_OPTIONS = {
  algorithm: 'sha256',
  encoding: 'hex',
} satisfies CreateHmacOptions

/**
 * Creates a HMAC of the given message using the specified key, algorithm and encoding
 * @param message - The message to compute the HMAC for
 * @param key - The key to use for the HMAC
 * @param options - The options to use for computing the HMAC @default @see {@link DEFAULT_CREATE_HMAC_OPTIONS}
 * @returns The HMAC of the message
 */
export function createHmac(
  message: BinaryLike,
  key: BinaryLike | KeyObject,
  options?: Partial<CreateHmacOptions>,
): string {
  const mergedOptions = { ...DEFAULT_CREATE_HMAC_OPTIONS, ...options }
  const { algorithm, encoding } = mergedOptions
  return nodeCreateHmac(algorithm, key).update(message).digest(encoding)
}
