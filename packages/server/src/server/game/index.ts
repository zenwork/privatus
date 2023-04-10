import { RouterContext, ServerSentEventTarget } from 'oak'
import { GameID } from '../common/game.ts'
import { Message } from '../common/messages.ts'
import { PlayerID } from '../common/players.ts'

export * from './game.ts'
export * from './game-store.ts'

export interface Game {
    key: GameID
    players: Player[]
    openChannel: (id: PlayerID, ctx: RouterContext<any, any, any>) => void

    notifyAll(msg: Message): boolean

    close(): void
}

export type Player = {
    id: PlayerID
    mailbox: Message[]
    channel: ServerSentEventTarget | null
}

export interface GameStore {
    createGame(): GameID

    endGame(id: GameID): Message

    get(id: GameID): Game | undefined

    addPlayerToGame(id: GameID, p: PlayerID): Message

    findPlayer(player: PlayerID): Player | undefined
}
