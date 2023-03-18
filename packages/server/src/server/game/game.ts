import { RouterContext, ServerSentEvent, ServerSentEventTarget } from 'oak'

export function register(id: { game: string; role: string; player: string }, ctx: RouterContext<any, any, any>) {
    console.log(`setting up SSE for ${id.game} - ${id.player} (${id.role})`)
    const target = ctx.sendEvents()
    setInterval(() => {
        target.dispatchEvent(new ServerSentEvent('ping', { hearbeat: Date.now(), id }))
    }, 700)
}

export type GameID = string
export type Game = {
    key: GameID
    players: Player[]
    openChannel: (id: PlayerID, ctx: RouterContext<any, any, any>) => void
    notifyAll(msg: Message): boolean
}
export type PlayerID = { id: string; type: string }

export enum MessageType {
    TEXT = 'text',
    STATUS = 'satus',
}

export type Message = { type: MessageType; body: string }

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
            game.players.push({ id: pid, mailbox: [], channel: null })
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
    key: GameID
    players: Player[]

    constructor(id: GameID) {
        this.key = id
        this.players = []
    }

    openChannel(id: PlayerID, ctx: RouterContext<any, any, any>) {
        const player = this.getPlayer(id)

        if (player && !player.channel) {
            try {
                player.channel = ctx.sendEvents()
                setInterval(() => {
                    this.hearbeat(player, id)
                    this.clearMailbox(player)
                }, 1000)
            } catch (e) {
                console.error(`Unable to open channel for ${id} - ${e.message}}`)
            }
        }
    }

    private getPlayer(id: PlayerID) {
        return this.players.find((p) => JSON.stringify(p.id) === JSON.stringify(id))
    }

    private hearbeat(player: Player, id: PlayerID) {
        player.channel?.dispatchEvent(new ServerSentEvent('ping', { hearbeat: Date.now(), id }))
    }

    private clearMailbox(player: Player) {
        if (player.mailbox.length > 0) {
            while (player.mailbox.length > 0) {
                const message = player.mailbox.splice(0, 1)[0]
                player.channel?.dispatchEvent(new ServerSentEvent('msg', message))
            }
        }
    }

    notifyAll(msg: Message) {
        this.players.forEach((p) => {
            // console.log('push')
            p.mailbox.push(msg)
        })
        return true
    }
}
