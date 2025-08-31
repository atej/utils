import { attemptAsync } from '../../functions/attempt-async.ts'
import type { Result } from '../../types/result.ts'

/**
 * Options that determine how the hash is computed e.g. algorithm and encoding
 */
export type CreateHashOptions = {
  /**
   * The algorithm to use for computing the hash
   * @example 'SHA-256'
   */
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
}

const DEFAULT_CREATE_HASH_OPTIONS = {
  algorithm: 'SHA-256',
} satisfies CreateHashOptions

/**
 * Uses the Web Crypto API to create a hash of the given message using the specified algorithm.
 * @param message - The message to hash
 * @param options - The options to use for computing the hash @default 'SHA-256'
 * @returns The result of the hash operation
 */
export async function createHash(
  message: string,
  options?: Partial<CreateHashOptions>,
): Promise<Result<string, Error>> {
  const mergedOptions = { ...DEFAULT_CREATE_HASH_OPTIONS, ...options }
  const { algorithm } = mergedOptions

  const createHash = async () => {
    const buffer = await crypto.subtle.digest(algorithm, new TextEncoder().encode(message))
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const result = await attemptAsync(createHash)

  return result
}
