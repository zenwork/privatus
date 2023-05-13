import { RouterContext, ServerSentEventTarget } from 'oak'
import { GameID, Message, PlayerID, Result } from '../../../../common/src/index.ts'

export * from './game.ts'
export * from './game-store.ts'

export type Game = {
  key: GameID
  players: Player[]
  openChannel: (id: PlayerID, ctx: RouterContext<any, any, any>, max: number) => void
  forward(msg: Message): boolean
  closeAllChannels(): void
}

export type Player = {
  id: PlayerID
  heartbeatId?: number
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

export { generateId } from './util.ts'
