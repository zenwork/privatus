import {RouterContext, ServerSentEvent} from 'oak'

export function register(id: { game: any; role: any; player: any }, ctx: RouterContext<any, any, any>) {
    console.log(`setting up SSE for ${id.game} - ${id.player} (${id.role})`)
    const target = ctx.sendEvents()
    setInterval(() => {
        target.dispatchEvent(new ServerSentEvent('ping', {hearbeat: Date.now(), id}))
    }, 700)
}

export type GameID = string
export type Player = { id: string, type: string }
export type Game = { key: GameID, players: Player[] }

export interface GameStore {
    createGame(): GameID

    endGame(id: GameID): boolean

    get(id: GameID): Game | undefined
}


export class GameStoreImplementation implements GameStore {

    private games: Map<GameID, Game> = new Map<GameID, Game>()

    createGame(): GameID {
        const id = generateId()
        this.games.set(id, {key: id, players: []})
        return id
    }

    endGame(id: GameID): boolean {
        return false

    }

    get(id: GameID): Game | undefined {
        return this.games.get(id)
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
