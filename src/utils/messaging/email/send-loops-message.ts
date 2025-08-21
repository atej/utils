import type { FetchResult } from '@atej/utils'
import z from 'zod/v4'
import { attemptFetch } from '../../functions/attempt-fetch.ts'
import { omitNullish } from '../../objects/omit-nullish.ts'
import { emailSchema } from '../../schemas/mod.ts'
import { messageDataVariablesSchema, type MessageDataVariablesZodSchema } from '../schemas.ts'

type SendLoopsTemplateMessageParamsZodSchema = z.ZodObject<{
  credentials: z.ZodObject<{
    secretKey: z.ZodString
  }, z.core.$strip>
  to: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodEmail>
  }, z.core.$strip>
  template: z.ZodObject<{
    id: z.ZodString
    dataVariables: z.ZodOptional<MessageDataVariablesZodSchema>
  }, z.core.$strip>
  options: z.ZodOptional<
    z.ZodObject<{
      addToAudience: z.ZodOptional<z.ZodBoolean>
      attachments: z.ZodOptional<
        z.ZodArray<
          z.ZodObject<{
            filename: z.ZodString
            contentType: z.ZodString
            data: z.ZodString
          }, z.core.$strip>
        >
      >
      idempotencyKey: z.ZodOptional<z.ZodString>
    }, z.core.$strip>
  >
}, z.core.$strip>

/** Zod schema to validate parameters for `sendLoopsMessage`. */
export const sendLoopsTemplateMessageParamsSchema: SendLoopsTemplateMessageParamsZodSchema = z
  .object({
    credentials: z.object({
      secretKey: z.string(),
    }),
    to: z.object({
      email: emailSchema,
    }),
    template: z.object({
      id: z.string(),
      dataVariables: messageDataVariablesSchema.optional(),
    }),
    options: z.object({
      addToAudience: z.boolean().optional(),
      attachments: z.array(z.object({
        filename: z.string(),
        contentType: z.string(),
        data: z.string(),
      })).optional(),
      idempotencyKey: z.string().optional(),
    }).optional(),
  })

/** Parameters for `sendLoopsMessage`. */
export type SendLoopsTemplateMessageParams = z.infer<typeof sendLoopsTemplateMessageParamsSchema>

/**
 * Send a transactional email via Loops
 */
export async function sendLoopsTemplateMessage(
  { credentials, to, template, options }: SendLoopsTemplateMessageParams,
): Promise<FetchResult<SuccessResponseBody, FailureResponseBody>> {
  // https://loops.so/docs/api-reference/send-transactional-email#headers
  const headers = omitNullish({
    'Authorization': `Bearer ${credentials.secretKey}`,
    'Content-Type': 'application/json',
    'Idempotency-Key': options?.idempotencyKey,
  })

  const body = omitNullish({
    email: to.email,
    transactionalId: template.id,
    dataVariables: template.dataVariables ? omitNullish(template.dataVariables) : undefined,
    attachments: options?.attachments,
    addToAudience: options?.addToAudience,
  }) satisfies RequestBody

  return await attemptFetch<SuccessResponseBody, FailureResponseBody>(
    'https://app.loops.so/api/v1/transactional',
    { method: 'POST', headers, body: JSON.stringify(body) },
  )
}

//////////////////////////////
// #region Loops API Reference
//////////////////////////////

/**
 * Body of the request to send a transactional email to a contact.
 *
 * @see https://loops.so/docs/api-reference/send-transactional-email#request
 */
type RequestBody = {
  email: string
  transactionalId: string
  dataVariables: Record<string, string | number>
  addToAudience: boolean
  attachments: {
    filename: string
    contentType: string
    data: string
  }[]
}

/**
 * Body of the response if the request succeeded.
 *
 * @see https://loops.so/docs/api-reference/send-transactional-email#response
 */
type SuccessResponseBody = {
  success: true
}

/**
 * Body of the response if the request failed.
 *
 * @see https://loops.so/docs/api-reference/send-transactional-email#response
 */
type FailureResponseBody = {
  success: false
  path?: string
  message?: string
  error?: { path: string; message: string }
  transactionalId?: string
}

//////////////////////////////
// #endregion ////////////////
//////////////////////////////
