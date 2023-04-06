export type GameID = string

export enum PlayerRole {
  NONE = 0,
  CITIZEN = 1,
  ISSUER = 2,
  PROVIDER = 3,
  PROFESSIONAL = 4,
  LEDGER = 5,
  SERVER = 6,
  ALL = 99,
}

export type PlayerID = { key: string; type: PlayerRole }