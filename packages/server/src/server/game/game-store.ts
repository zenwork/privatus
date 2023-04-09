import { GameID, PlayerID, Result } from '../common/index.ts'
import { GameImplementation } from './game.ts'
import { Game, GameStore, Player } from './index.ts'

export class GameStoreImplementation implements GameStore {
    private games: Map<GameID, Game> = new Map<GameID, Game>()

    createGame(): GameID {
        const id = generateId()
        this.games.set(id, new GameImplementation(id))
        console.log('new game created:', id)
        return id
    }

    endGame(id: GameID): boolean {
        this.games.get(id)?.close()
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
