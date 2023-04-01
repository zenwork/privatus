import { GameID, Message, PlayerID } from 'common'
import { RouterContext, ServerSentEventTarget } from 'oak'

export * from './game.ts'
export * from './game-store.ts'

export type Game = {
  key: GameID
  players: Player[]
  openChannel: (id: PlayerID, ctx: RouterContext<any, any, any>) => void
  notify(msg: Message): boolean
  close(): void
}

export type Player = {
  id: PlayerID
  mailbox: Message[]
  channel: ServerSentEventTarget | null
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
