import { RouterContext, ServerSentEvent } from 'oak'

export function register(id: { game: string; role: string; player: string }, ctx: RouterContext<any, any, any>) {
    console.log(`setting up SSE for ${id.game} - ${id.player} (${id.role})`)
    const target = ctx.sendEvents()
    setInterval(() => {
        target.dispatchEvent(new ServerSentEvent('ping', { hearbeat: Date.now(), id }))
    }, 700)
}

export type GameID = string
export type Game = { key: GameID; players: Player[] }
export type PlayerID = { id: string; type: string }

export enum MessageType {
    TEXT = 'text',
    STATUS = 'satus',
}

export type Message = { type: MessageType; body: string }

export type Player = { id: PlayerID; mailbox: Message[] }

export interface GameStore {
    createGame(): GameID

    endGame(id: GameID): boolean

    get(id: GameID): Game | undefined

    addPlayerToGame(id: GameID, p: PlayerID): Result

    findPlayer(player: PlayerID): Player | undefined
}

export type Result = { success: boolean; messages: string[] }

export class GameStoreImplementation implements GameStore {
    private games: Map<GameID, Game> = new Map<GameID, Game>()

    createGame(): GameID {
        const id = generateId()
        this.games.set(id, new GameImplementation(id))
        console.log('new game created:', id)
        return id
    }

    endGame(id: GameID): boolean {
        return this.games.delete(id)
    }

    get(id: GameID): Game | undefined {
        return this.games.get(id)
    }

    addPlayerToGame(id: GameID, pid: PlayerID): Result {
        const result: Result = { success: false, messages: [] }
        if (!this.games.has(id)) {
            result.messages.push('game does not exist')
        }

        const game = this.games.get(id)

        if (game && !game.players.some((p) => p.id === pid)) {
            game.players.push({ id: pid, mailbox: [] })
            result.messages.push('player created')
            result.success = true
        }

        return result
    }

    findPlayer(searchId: PlayerID): Player | undefined {
        let found: Player | undefined
        for (const gameId of this.games.keys()) {
            found = this.games.get(gameId)?.players.find((p) => p.id === searchId)
            if (found) {
                break
            }
        }
        return found
    }
}

function generateId(length = 5): string {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

class GameImplementation implements Game {
    constructor(id: GameID) {
        this.key = id
        this.players = []
    }

    key: GameID
    players: Player[]
}
