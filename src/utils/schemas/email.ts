import { z } from 'zod/v4'

/**
 * A Zod schema for email addresses. The value is first validated as a string, then trimmed, then
 * converted to lowercase, then validated as an email address.
 *
 * @example
 * ```ts
 * const email = emailSchema.parse('  JOHN@EXAMPLE.COM  ')
 * console.log(email) // 'john@example.com'
 * ```
 */
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email())
