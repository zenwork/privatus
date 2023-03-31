import { RouterContext, ServerSentEventTarget } from 'oak'

export * from './game.ts'
export * from './game-store.ts'

export type GameID = string
export type Game = {
  key: GameID
  players: Player[]
  openChannel: (id: PlayerID, ctx: RouterContext<any, any, any>) => void
  notifyAll(msg: Message): boolean
  close(): void
}

export enum PlayerType {
  CITIZEN = 'citizen',
  ISSUER = 'issuer',
  PROVIDER = 'provider',
  PROFESSIONAL = 'professional',
  LEDGER = 'ledger',
  ALL = '*',
  NONE = '!',
}

export type PlayerID = { id: string; type: PlayerType }
export type Player = {
  id: PlayerID
  mailbox: Message[]
  channel: ServerSentEventTarget | null
}

export enum MessageType {
  TEXT = 'text',
  STATUS = 'status',
}

export type Message = {
  type: MessageType
  body: string
  origin: PlayerID
  destination: PlayerID
}

export interface GameStore {
  createGame(): GameID

  endGame(id: GameID): boolean

  get(id: GameID): Game | undefined

  addPlayerToGame(id: GameID, p: PlayerID): Result

  findPlayer(player: PlayerID): Player | undefined
}

export type Result = { success: boolean; messages: string[] }
