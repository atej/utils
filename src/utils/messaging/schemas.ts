import { z } from 'zod/v4'

export const messageDataVariablesSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.undefined(), z.null()]),
)

export type MessageDataVariables = z.infer<typeof messageDataVariablesSchema>
