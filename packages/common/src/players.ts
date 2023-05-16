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

export type PlayerID = { key: string; type: PlayerRole }
