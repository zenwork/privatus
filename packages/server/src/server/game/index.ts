import { Message } from '#/common/messages.ts'
import { RouterContext, ServerSentEventTarget } from 'oak'
import { GameID, PlayerID } from '#/common/players.ts'

export * from './game.ts'
export * from './game-store.ts'

export type Game = {
  key: GameID
  players: Player[]
  openChannel: (id: PlayerID, ctx: RouterContext<any, any, any>) => void
  forward(msg: Message): boolean
  closeChannel(): void
}

export type Player = {
  id: PlayerID
  mailbox: Message[]
  channel: ServerSentEventTarget | null
}

export interface GameStore {
  create(): GameID

  get(id: GameID): Game | undefined

  end(id: GameID): boolean

  addPlayerToGame(id: GameID, p: PlayerID): Result

  findPlayerBy(player: PlayerID): Player | undefined
}

export type Result = { success: boolean; messages: string[] }
export { generateId } from './util.ts'
