import { PlayerRole } from '../../../../common/src/players.ts'
import { Player } from './index.ts'

export const LedgerPlayerFactory = (): Player => ({
  id: { game: 'ALL', key: 'ledger', type: PlayerRole.LEDGER },
  mailbox: [],
  channel: null,
})

export const ServerPlayerFactory = (): Player => ({
  id: { game: 'ALL', key: 'server', type: PlayerRole.SERVER },
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

export function toPlayerType(role: string): PlayerRole {
  const ptype: PlayerRole = PlayerRole[role as keyof typeof PlayerRole]
  return ptype ? ptype : PlayerRole.NONE
}
