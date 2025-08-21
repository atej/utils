import { z } from 'zod/v4'

export type MessageDataVariablesZodSchema = z.ZodRecord<
  z.ZodString,
  z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodUndefined, z.ZodNull]>
>
export const messageDataVariablesSchema: MessageDataVariablesZodSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.undefined(), z.null()]),
)

export type MessageDataVariables = z.infer<typeof messageDataVariablesSchema>
