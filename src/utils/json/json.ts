import LZString from 'lz-string'
import type { Result } from '../../types/result'
import { attempt } from '../errors/attempt'

type JSONOptions = { compression?: boolean }
type JsonStringifyParameters = Parameters<typeof JSON.stringify>
type JsonParseParameters = Parameters<typeof JSON.parse>

const DEFAULT_JSON_OPTIONS: JSONOptions = {
  compression: false,
}

/**
 * Wraps JSON serialization and deserialization for explicit error handling. Optionally allows
 * compression of the serialized string.
 *
 * @param options - The options for serializing and deserializing.
 * @returns An object with stringify and parse methods for JSON.
 */
export function json(options?: JSONOptions): {
  stringify: (...params: JsonStringifyParameters) => Result<string, JsonError>
  parse: (...params: JsonParseParameters) => Result<unknown, JsonError>
} {
  const { compression } = { ...DEFAULT_JSON_OPTIONS, ...options }

  if (compression) {
    return {
      stringify: (...params: JsonStringifyParameters) => {
        return attempt(
          function () {
            const stringified = JSON.stringify(...params)
            const compressed = LZString.compressToEncodedURIComponent(stringified)
            return compressed
          },
          (error) =>
            new JsonError(
              `Failed to serialize to JSON string and compress: ${error instanceof Error ? error.message : String(error)}`,
              'stringify',
              error,
              params[0],
              true,
            ),
        )
      },
      parse: (...params: JsonParseParameters) => {
        return attempt(
          function () {
            const decompressed = LZString.decompressFromEncodedURIComponent(params[0])
            const parsed = JSON.parse(decompressed, params[1])
            return parsed
          },
          (error) =>
            new JsonError(
              `Failed to parse compressed JSON string: ${error instanceof Error ? error.message : String(error)}`,
              'parse',
              error,
              params[0],
              true,
            ),
        )
      },
    }
  } else {
    return {
      stringify: (...params: JsonStringifyParameters) => {
        return attempt(
          () => JSON.stringify(...params),
          (error) =>
            new JsonError(
              `Failed to serialize to JSON string: ${error instanceof Error ? error.message : String(error)}`,
              'stringify',
              error,
              params[0],
            ),
        )
      },
      parse: (...params: JsonParseParameters) => {
        return attempt(
          () => JSON.parse(...params),
          (error) =>
            new JsonError(
              `Failed to parse JSON string: ${error instanceof Error ? error.message : String(error)}`,
              'parse',
              error,
              params[0],
            ),
        )
      },
    }
  }
}

class JsonError extends Error {
  constructor(
    message: string,
    public readonly operation: 'parse' | 'stringify',
    public readonly originalError: unknown,
    public readonly input?: unknown,
    public readonly compression?: boolean,
  ) {
    super(message)
    this.name = 'JsonError'
  }
}
