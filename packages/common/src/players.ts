export type GameID = string

export enum PlayerRole {
  NONE = 'NONE',
  CITIZEN = 'CITIZEN',
  ISSUER = 'ISSUER',
  PROVIDER = 'PROVIDER',
  PROFESSIONAL = 'PROFESSIONAL',
  LEDGER = 'LEDGER',
  SERVER = 'SERVER',
  ALL = 'ALL',
}

export type PlayerID = { game: GameID, key: string; type: PlayerRole }

export function toPlayerRole(role: string): PlayerRole {
  const ptype: PlayerRole = PlayerRole[role as keyof typeof PlayerRole]
  return ptype ? ptype : PlayerRole.NONE
}

export function isSamePid(pid1: PlayerID, pid2: PlayerID): boolean {
  return (
    pid1.game === pid2.game && pid1.key === pid2.key && pid1.type === pid2.type
  )
}
