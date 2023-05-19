import type { Context } from '@lit-labs/context'
import { Message } from 'common'

export type Registry = { p: string[] }

export const key = 'prism-registry' as Context<'prism-registry', Registry>
export const messageKey = 'prism-message' as Context<
  'prism-message',
  Message | undefined
>
