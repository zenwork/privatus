import { GameID, GameKey } from '../common/game.ts'
import { ended, Message, MessageType, notEnded } from '../common/messages.ts'
import { PlayerID, Role } from '../common/players.ts'
import { GameImplementation } from './game.ts'
import { Game, GameStore, Player } from './index.ts'

export class GameStoreImplementation implements GameStore {
    private games: Map<GameID, Game> = new Map<GameID, Game>()

    createGame(): GameID {
        const id = new GameKey().toString()
        this.games.set(id, new GameImplementation(id))
        console.log('new game created:', id)
        return id
    }

    endGame(id: GameID): Message {
        const game = this.games.get(id)
        if (game) {
            game.close()
            this.games.delete(id)
            return ended
        }
        return notEnded
    }

    get(id: GameID): Game | undefined {
        return this.games.get(id)
    }

    addPlayerToGame(id: GameID, pid: PlayerID): Message {
        let type = MessageType.ERROR
        const result = []
        if (!this.games.has(id)) {
            result.push('game does not exist')
        }

        const game = this.games.get(id)

        if (game && !game.players.some((p) => p.id === pid)) {
            game.players.push({ id: pid, mailbox: [], channel: null })
            result.push('player created')
            type = MessageType.INFO
        }
        return new Message(type, result.join(','), Role.TECHNICAL, Role.ANY)
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
