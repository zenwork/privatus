import type { Context } from '@lit-labs/context'
// @ts-ignore
import { Message } from '../../../common/messages.ts'

export type Registry = { p: string[] }

export const key = 'prism-registry' as Context<'prism-registry', Registry>
export const messageKey = 'prism-message' as Context<
  'prism-message',
  Message | undefined
>
