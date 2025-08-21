import Mustache from 'mustache'
import z from 'zod/v4'
import { attemptFetch, type FetchResult } from '../../functions/attempt-fetch.ts'
import { omitNullish } from '../../objects/omit-nullish.ts'
import { messageDataVariablesSchema } from '../schemas.ts'

/////////////////////////////////
// #region Configuration ////////
/////////////////////////////////

// Prevent mustache from escaping special characters
Mustache.escape = function (text: string) {
  return text
}

const API_BASE_URL = 'https://wbiztool.com/api'
const SEND_MESSAGE_ENDPOINT = `${API_BASE_URL}/v1/send_msg/`

const MESSAGE_TYPE_MAP = { text: 0, image: 1, file: 2 } as const

/////////////////////////////////
// #endregion ///////////////////
/////////////////////////////////

////////////////////////////////
// #region Sub-schemas /////////
////////////////////////////////

const credentialsSchema = z.object({
  apiKey: z.string(),
  clientId: z.string(),
  waClientId: z.string(),
})

const toSchema = z.union([
  z.object({
    phone: z.string(),
    phoneCode: z.string(),
    groupName: z.undefined().optional(),
  }),
  z.object({
    phone: z.undefined().optional(),
    phoneCode: z.undefined().optional(),
    groupName: z.string(),
  }),
])

const messageSchema = z.union([
  z.object({
    type: z.literal('text'),
    text: z.string(),
    imageUrl: z.undefined().optional(),
    fileName: z.undefined().optional(),
    fileUrl: z.undefined().optional(),
  }),
  z.object({
    type: z.literal('image'),
    text: z.string(),
    imageUrl: z.string(),
    fileName: z.undefined().optional(),
    fileUrl: z.undefined().optional(),
  }),
  z.object({
    type: z.literal('file'),
    text: z.string(),
    imageUrl: z.undefined().optional(),
    fileName: z.string(),
    fileUrl: z.string(),
  }),
])
type Message = z.infer<typeof messageSchema>

const optionsSchema = z.object({
  /** Expire message if not sent before this many seconds. */
  expiresAfter: z.number().optional(),
  /** Webhook URL where message id and status will be posted. */
  webhookUrl: z.string().optional(),
})

/**
 * Zod schema to validate the template for the `sendWbtTemplateMessage` function.
 * Either specify the message directly or specify the template id and the templates object.
 */
const templateSchema = z.intersection(
  z.union([
    z.object({
      message: messageSchema,
      id: z.undefined().optional(),
      templates: z.undefined().optional(),
    }),
    z.object({
      id: z.string(),
      templates: z.record(z.string(), messageSchema),
      message: z.undefined().optional(),
    }),
  ]),
  z.object({ dataVariables: messageDataVariablesSchema }),
)

const baseSchema = z.object({
  credentials: credentialsSchema,
  to: toSchema,
  options: optionsSchema.optional(),
})

////////////////////////////////
// #endregion //////////////////
////////////////////////////////

/** Zod schema to validate the parameters for the `sendWbtMessage` function. */
export const sendWbtMessageParamsSchema = baseSchema.extend({
  message: messageSchema,
})

/** Type of the parameters for the `sendWbtMessage` function. */
export type SendWbtMessageParams = z.infer<typeof sendWbtMessageParamsSchema>

/** Send a WhatsApp message to a phone number or group via Wbiztool. */
export async function sendWbtMessage(
  params: SendWbtMessageParams,
): Promise<FetchResult<SuccessResponseBody, FailureResponseBody>> {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
  const body = omitNullish({
    // credentials
    api_key: params.credentials.apiKey,
    client_id: params.credentials.clientId,
    whatsapp_client: params.credentials.waClientId,
    // receiver
    phone: `${params.to.phoneCode?.replace('+', '').trim()}${params.to.phone?.trim()}`.trim(),
    group_name: params.to.groupName,
    // message
    msg_type: MESSAGE_TYPE_MAP[params.message.type],
    msg: params.message.text,
    img_url: params.message.imageUrl,
    file_url: params.message.fileUrl,
    file_name: params.message.fileName,
    // options
    expires_after_seconds: params.options?.expiresAfter,
    webhook: params.options?.webhookUrl,
  }) satisfies RequestBody

  return await attemptFetch<SuccessResponseBody, FailureResponseBody>(
    SEND_MESSAGE_ENDPOINT,
    { method: 'POST', headers, body: JSON.stringify(body) },
  )
}

/** Zod schema to validate the parameters for the `sendWbtTemplateMessage` function. */
export const sendWbtTemplateMessageParamsSchema = baseSchema.extend({
  template: templateSchema,
})

/** Type of the parameters for the `sendWbtTemplateMessage` function. */
export type SendWbtTemplateMessageParams = z.infer<typeof sendWbtTemplateMessageParamsSchema>

/** Send a WhatsApp template message to a phone number or group via Wbiztool. */
export async function sendWbtTemplateMessage(
  params: SendWbtTemplateMessageParams,
): Promise<FetchResult<SuccessResponseBody, FailureResponseBody>> {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }

  const message: Message = params.template.message ??
    params.template.templates?.[params.template.id] ?? {
    type: 'text',
    text: '',
    imageUrl: undefined,
    fileName: undefined,
    fileUrl: undefined,
  }

  if (message.type === 'text' && !message.text) {
    return {
      data: undefined,
      error: new Error('A template message of type "text" has empty text!'),
    }
  }

  // Replace data variables in message fields
  const dataVariables = omitNullish(params.template.dataVariables)
  let { text, imageUrl, fileName, fileUrl } = message
  if (text) text = Mustache.render(text, dataVariables)
  if (imageUrl) imageUrl = Mustache.render(imageUrl, dataVariables)
  if (fileName) fileName = Mustache.render(fileName, dataVariables)
  if (fileUrl) fileUrl = Mustache.render(fileUrl, dataVariables)

  const body = omitNullish({
    // credentials
    api_key: params.credentials.apiKey,
    client_id: params.credentials.clientId,
    whatsapp_client: params.credentials.waClientId,
    // receiver
    phone: `${params.to.phoneCode?.replace('+', '').trim()}${params.to.phone?.trim()}`.trim(),
    group_name: params.to.groupName,
    // message
    msg_type: MESSAGE_TYPE_MAP[message.type],
    msg: text,
    img_url: imageUrl,
    file_url: fileUrl,
    file_name: fileName,
    // options
    expires_after_seconds: params.options?.expiresAfter,
    webhook: params.options?.webhookUrl,
  }) satisfies RequestBody

  return await attemptFetch<SuccessResponseBody, FailureResponseBody>(
    SEND_MESSAGE_ENDPOINT,
    { method: 'POST', headers, body: JSON.stringify(body) },
  )
}

/////////////////////////////////////
// #region Wbiztool API Reference ///
/////////////////////////////////////

/**
 * Body of the request to send a message.
 *
 * @see https://wbiztool.com/docs/send-message-api/
 */
type RequestBody = {
  api_key: string
  client_id: string
  whatsapp_client: string
  msg: string
  msg_type: number
  phone: string
  group_name: string
  img_url: string
  file_url: string
  file_name: string
  expires_after_seconds: number
  webhook: string
}

/**
 * Body of the response if the request succeeded.
 *
 * @see https://wbiztool.com/docs/send-message-api/
 */
type SuccessResponseBody = {
  status: 1
  msg_id: number
  message: string
}

/**
 * Body of the response if the request failed.
 *
 * @see https://wbiztool.com/docs/send-message-api/
 */
type FailureResponseBody = {
  status: 0
  msg_id?: number
  message: string
}

/////////////////////////////////////
// #endregion ///////////////////////
/////////////////////////////////////
