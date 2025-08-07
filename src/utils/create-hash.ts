import {
  createHash as nodeCreateHash,
  type BinaryLike,
  type BinaryToTextEncoding,
} from 'node:crypto'

/**
 * Options that determine how the hash is computed e.g. algorithm and encoding
 */
export type CreateHashOptions = {
  /**
   * The algorithm to use for computing the hash
   * @example 'sha256'
   */
  algorithm: string
  /**
   * The encoding to use for the hash
   * @example 'hex'
   */
  encoding: BinaryToTextEncoding
}

const DEFAULT_CREATE_HASH_OPTIONS = {
  algorithm: 'sha256',
  encoding: 'hex',
} satisfies CreateHashOptions

/**
 * Creates a hash of the given message using the specified algorithm and encoding
 * @param message - The message to hash
 * @param options - The options to use for computing the hash @default @see {@link DEFAULT_CREATE_HASH_OPTIONS}
 * @returns The hash of the message
 */
export function createHash(message: BinaryLike, options?: Partial<CreateHashOptions>): string {
  const mergedOptions = { ...DEFAULT_CREATE_HASH_OPTIONS, ...options }
  const { algorithm, encoding } = mergedOptions
  return nodeCreateHash(algorithm).update(message).digest(encoding)
}
