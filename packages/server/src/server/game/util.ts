import { Player, PlayerType } from './index.ts'

export const LedgerPlayerFactory = (): Player => ({
  id: { id: 'LEDGER', type: PlayerType.LEDGER },
  mailbox: [],
  channel: null,
})

export const ServerPlayerFactory = (): Player => ({
  id: { id: 'LEDGER', type: PlayerType.LEDGER },
  mailbox: [],
  channel: null,
})

export function generateId(length = 5): string {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function toPlayerType(role: string): PlayerType {
  const ptype: PlayerType = PlayerType[role as keyof typeof PlayerType]
  return ptype ? ptype : PlayerType.NONE
}
