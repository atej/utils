import { describe, expect, it } from 'vitest'
import { createHmac, type CreateHmacOptions } from './create-hmac'

describe('createHmac', () => {
  it('should create HMAC with default options (sha256, hex)', () => {
    const message = 'hello world'
    const key = 'secret-key'
    const hmac = createHmac(message, key)

    // sha256 HMAC of "hello world" with key "secret-key" in hex
    expect(hmac).toBe('095d5a21fe6d0646db223fdf3de6436bb8dfb2fab0b51677ecf6441fcf5f2a67')
  })

  it('should create HMAC with custom algorithm', () => {
    const message = 'hello world'
    const key = 'secret-key'
    const hmac = createHmac(message, key, { algorithm: 'sha1' })

    // sha1 HMAC of "hello world" with key "secret-key" in hex
    expect(hmac).toBe('b84b002077152646a6da921cf58121705150a967')
  })

  it('should create HMAC with custom encoding', () => {
    const message = 'hello world'
    const key = 'secret-key'
    const hmac = createHmac(message, key, { encoding: 'base64' })

    // sha256 HMAC of "hello world" with key "secret-key" in base64
    expect(hmac).toBe('CV1aIf5tBkbbIj/fPeZDa7jfsvqwtRZ37PZEH89fKmc=')
  })

  it('should create HMAC with both custom algorithm and encoding', () => {
    const message = 'hello world'
    const key = 'secret-key'
    const hmac = createHmac(message, key, { algorithm: 'sha1', encoding: 'base64' })

    // sha1 HMAC of "hello world" with key "secret-key" in base64
    expect(hmac).toBe('uEsAIHcVJkam2pIc9YEhcFFQqWc=')
  })

  it('should handle Buffer input for message', () => {
    const message = Buffer.from('hello world', 'utf8')
    const key = 'secret-key'
    const hmac = createHmac(message, key)

    expect(hmac).toBe('095d5a21fe6d0646db223fdf3de6436bb8dfb2fab0b51677ecf6441fcf5f2a67')
  })

  it('should handle Buffer input for key', () => {
    const message = 'hello world'
    const key = Buffer.from('secret-key', 'utf8')
    const hmac = createHmac(message, key)

    expect(hmac).toBe('095d5a21fe6d0646db223fdf3de6436bb8dfb2fab0b51677ecf6441fcf5f2a67')
  })

  it('should handle Uint8Array input for message', () => {
    const message = new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]) // "hello world"
    const key = 'secret-key'
    const hmac = createHmac(message, key)

    expect(hmac).toBe('095d5a21fe6d0646db223fdf3de6436bb8dfb2fab0b51677ecf6441fcf5f2a67')
  })

  it('should handle Uint8Array input for key', () => {
    const message = 'hello world'
    const key = new Uint8Array([115, 101, 99, 114, 101, 116, 45, 107, 101, 121]) // "secret-key"
    const hmac = createHmac(message, key)

    expect(hmac).toBe('095d5a21fe6d0646db223fdf3de6436bb8dfb2fab0b51677ecf6441fcf5f2a67')
  })

  it('should handle empty string message', () => {
    const message = ''
    const key = 'secret-key'
    const hmac = createHmac(message, key)

    // sha256 HMAC of empty string with key "secret-key" in hex
    expect(hmac).toBe('345fba21f06a4f75ed673fb93dc16cd47d8dc7a69f52e84e3016fcf69835fdb8')
  })

  it('should handle empty string key', () => {
    const message = 'hello world'
    const key = ''
    const hmac = createHmac(message, key)

    // sha256 HMAC of "hello world" with empty key in hex
    expect(hmac).toBe('c2ea634c993f050482b4e6243224087f7c23bdd3c07ab1a45e9a21c62fad994e')
  })

  it('should handle empty Buffer message', () => {
    const message = Buffer.alloc(0)
    const key = 'secret-key'
    const hmac = createHmac(message, key)

    expect(hmac).toBe('345fba21f06a4f75ed673fb93dc16cd47d8dc7a69f52e84e3016fcf69835fdb8')
  })

  it('should handle empty Buffer key', () => {
    const message = 'hello world'
    const key = Buffer.alloc(0)
    const hmac = createHmac(message, key)

    expect(hmac).toBe('c2ea634c993f050482b4e6243224087f7c23bdd3c07ab1a45e9a21c62fad994e')
  })

  it('should handle unicode characters in message', () => {
    const message = 'hello 世界'
    const key = 'secret-key'
    const hmac = createHmac(message, key)

    // sha256 HMAC of "hello 世界" with key "secret-key" in hex
    expect(hmac).toBe('122598e35d8dc10cf0a3654a23105618d7a2250a556c4cff52afb6e60938acde')
  })

  it('should handle unicode characters in key', () => {
    const message = 'hello world'
    const key = 'secret-密钥'
    const hmac = createHmac(message, key)

    // sha256 HMAC of "hello world" with key "secret-密钥" in hex
    expect(hmac).toBe('8ca399c42b85ed745e798993f5ad04d052b88a6f9bb5ee6220be143b4d6e1c8e')
  })

  it('should handle large input', () => {
    const message = 'a'.repeat(10000)
    const key = 'secret-key'
    const hmac = createHmac(message, key)

    // Should produce a valid HMAC without errors
    expect(hmac).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should handle large key', () => {
    const message = 'hello world'
    const key = 'a'.repeat(10000)
    const hmac = createHmac(message, key)

    // Should produce a valid HMAC without errors
    expect(hmac).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should work with different algorithms', () => {
    const message = 'test'
    const key = 'secret-key'
    const algorithms = ['md5', 'sha1', 'sha256', 'sha512']

    algorithms.forEach((algorithm) => {
      const hmac = createHmac(message, key, { algorithm })
      expect(hmac).toBeTruthy()
      expect(typeof hmac).toBe('string')
    })
  })

  it('should work with different encodings', () => {
    const message = 'test'
    const key = 'secret-key'
    const encodings: Array<CreateHmacOptions['encoding']> = ['hex', 'base64', 'base64url']

    encodings.forEach((encoding) => {
      const hmac = createHmac(message, key, { encoding })
      expect(hmac).toBeTruthy()
      expect(typeof hmac).toBe('string')
    })
  })

  it('should merge options correctly', () => {
    const message = 'test'
    const key = 'secret-key'

    // Test that partial options are merged with defaults
    const hmac1 = createHmac(message, key, { algorithm: 'md5' })
    const hmac2 = createHmac(message, key, { algorithm: 'md5', encoding: 'hex' })

    expect(hmac1).toBe(hmac2)
  })

  it('should handle special characters in message', () => {
    const message = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const key = 'secret-key'
    const hmac = createHmac(message, key)

    expect(hmac).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should handle special characters in key', () => {
    const message = 'hello world'
    const key = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const hmac = createHmac(message, key)

    expect(hmac).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should produce consistent results for same input', () => {
    const message = 'consistent test'
    const key = 'secret-key'
    const options = { algorithm: 'sha256', encoding: 'hex' as const }

    const hmac1 = createHmac(message, key, options)
    const hmac2 = createHmac(message, key, options)

    expect(hmac1).toBe(hmac2)
  })

  it('should produce different results for different messages', () => {
    const message1 = 'hello'
    const message2 = 'world'
    const key = 'secret-key'
    const options = { algorithm: 'sha256', encoding: 'hex' as const }

    const hmac1 = createHmac(message1, key, options)
    const hmac2 = createHmac(message2, key, options)

    expect(hmac1).not.toBe(hmac2)
  })

  it('should produce different results for different keys', () => {
    const message = 'hello world'
    const key1 = 'key1'
    const key2 = 'key2'
    const options = { algorithm: 'sha256', encoding: 'hex' as const }

    const hmac1 = createHmac(message, key1, options)
    const hmac2 = createHmac(message, key2, options)

    expect(hmac1).not.toBe(hmac2)
  })

  it('should produce different results for different algorithms', () => {
    const message = 'hello world'
    const key = 'secret-key'
    const encoding = 'hex' as const

    const hmac1 = createHmac(message, key, { algorithm: 'sha256', encoding })
    const hmac2 = createHmac(message, key, { algorithm: 'sha1', encoding })

    expect(hmac1).not.toBe(hmac2)
  })

  it('should produce different results for different encodings', () => {
    const message = 'hello world'
    const key = 'secret-key'
    const algorithm = 'sha256'

    const hmac1 = createHmac(message, key, { algorithm, encoding: 'hex' })
    const hmac2 = createHmac(message, key, { algorithm, encoding: 'base64' })

    expect(hmac1).not.toBe(hmac2)
  })

  it('should handle KeyObject input', async () => {
    const { createSecretKey } = await import('node:crypto')
    const message = 'hello world'
    const keyBuffer = Buffer.from('secret-key', 'utf8')
    const keyObject = createSecretKey(keyBuffer)

    const hmac = createHmac(message, keyObject)

    expect(hmac).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should handle binary data correctly', () => {
    const message = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04])
    const key = Buffer.from([0xff, 0xfe, 0xfd, 0xfc, 0xfb])
    const hmac = createHmac(message, key)

    expect(hmac).toMatch(/^[a-f0-9]{64}$/)
  })
})
