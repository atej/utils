import { describe, expect, it } from 'vitest'
import { createHash, type CreateHashOptions } from './create-hash.ts'

describe('createHash', () => {
  it('should create hash with default options (sha256, hex)', () => {
    const message = 'hello world'
    const hash = createHash(message)

    // sha256 hash of "hello world" in hex
    expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9')
  })

  it('should create hash with custom algorithm', () => {
    const message = 'hello world'
    const hash = createHash(message, { algorithm: 'md5' })

    // md5 hash of "hello world" in hex
    expect(hash).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3')
  })

  it('should create hash with custom encoding', () => {
    const message = 'hello world'
    const hash = createHash(message, { encoding: 'base64' })

    // sha256 hash of "hello world" in base64
    expect(hash).toBe('uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=')
  })

  it('should create hash with both custom algorithm and encoding', () => {
    const message = 'hello world'
    const hash = createHash(message, { algorithm: 'sha1', encoding: 'base64' })

    // sha1 hash of "hello world" in base64
    expect(hash).toBe('Kq5sNclPz7QV2+lfQIuc6R7oRu0=')
  })

  it('should handle Buffer input', () => {
    const message = Buffer.from('hello world', 'utf8')
    const hash = createHash(message)

    expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9')
  })

  it('should handle Uint8Array input', () => {
    const message = new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]) // "hello world"
    const hash = createHash(message)

    expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9')
  })

  it('should handle empty string', () => {
    const message = ''
    const hash = createHash(message)

    // sha256 hash of empty string in hex
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })

  it('should handle empty Buffer', () => {
    const message = Buffer.alloc(0)
    const hash = createHash(message)

    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })

  it('should handle unicode characters', () => {
    const message = 'hello 世界'
    const hash = createHash(message)

    // sha256 hash of "hello 世界" in hex
    expect(hash).toBe('2e2625f7c51b4a2c75274ab307e86411f57aab475f4a4078df53533f7771bc7f')
  })

  it('should handle large input', () => {
    const message = 'a'.repeat(10000)
    const hash = createHash(message)

    // Should produce a valid hash without errors
    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should work with different algorithms', () => {
    const message = 'test'
    const algorithms = ['md5', 'sha1', 'sha256', 'sha512']

    algorithms.forEach((algorithm) => {
      const hash = createHash(message, { algorithm })
      expect(hash).toBeTruthy()
      expect(typeof hash).toBe('string')
    })
  })

  it('should work with different encodings', () => {
    const message = 'test'
    const encodings: Array<CreateHashOptions['encoding']> = ['hex', 'base64', 'base64url']

    encodings.forEach((encoding) => {
      const hash = createHash(message, { encoding })
      expect(hash).toBeTruthy()
      expect(typeof hash).toBe('string')
    })
  })

  it('should merge options correctly', () => {
    const message = 'test'

    // Test that partial options are merged with defaults
    const hash1 = createHash(message, { algorithm: 'md5' })
    const hash2 = createHash(message, { algorithm: 'md5', encoding: 'hex' })

    expect(hash1).toBe(hash2)
  })

  it('should handle special characters in input', () => {
    const message = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const hash = createHash(message)

    expect(hash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should produce consistent results for same input', () => {
    const message = 'consistent test'
    const options = { algorithm: 'sha256', encoding: 'hex' as const }

    const hash1 = createHash(message, options)
    const hash2 = createHash(message, options)

    expect(hash1).toBe(hash2)
  })

  it('should produce different results for different inputs', () => {
    const message1 = 'hello'
    const message2 = 'world'
    const options = { algorithm: 'sha256', encoding: 'hex' as const }

    const hash1 = createHash(message1, options)
    const hash2 = createHash(message2, options)

    expect(hash1).not.toBe(hash2)
  })
})
