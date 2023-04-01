import { RouterContext, ServerSentEventTarget } from 'oak'

export * from './game.ts'
export * from './game-store.ts'

export type GameID = string
export type Game = {
  key: GameID
  players: Player[]
  openChannel: (id: PlayerID, ctx: RouterContext<any, any, any>) => void
  notify(msg: Message): boolean
  close(): void
}

export enum PlayerType {
  NONE = 0,
  CITIZEN = 1,
  ISSUER = 2,
  PROVIDER = 3,
  PROFESSIONAL = 4,
  LEDGER = 5,
  SERVER = 6,
  ALL = 99,
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
  destination: PlayerType
}

export interface GameStore {
  createGame(): GameID

  endGame(id: GameID): boolean

  get(id: GameID): Game | undefined

  addPlayerToGame(id: GameID, p: PlayerID): Result

  findPlayer(player: PlayerID): Player | undefined
}

export type Result = { success: boolean; messages: string[] }
export { generateId } from './util.ts'
