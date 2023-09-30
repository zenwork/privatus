import { Result } from '../../../../common/src/messages.ts'
import { GameID, PlayerID } from '../../../../common/src/players.ts'
import { GameImplementation } from './game.ts'
import { Game, GameStore, Player } from './index.ts'
import { MockGame } from './mock.ts'
import { generateId, isSamePid } from './util.ts'

export class GameStoreImplementation implements GameStore {
  private games: Map<GameID, Game> = new Map<GameID, Game>()

  create(): GameID {
    const id = generateId()
    this.games.set(id, new GameImplementation(id))
    console.log('new game created:', id)
    return id as GameID
  }

  createMock(): GameID {
    const id = generateId()
    this.games.set(id, new MockGame(id))
    console.log('new mock game created:', id)
    return id as GameID
  }

  end(id: GameID): boolean {
    this.games.get(id)?.closeAllChannels()
    return this.games.delete(id)
  }

  get(id: GameID): Game | undefined {
    return this.games.get(id)
  }

  addPlayerToGame(pid: PlayerID): Result {
    const result: Result = { success: false, messages: [] }
    if (!this.games.has(pid.game)) {
      result.messages.push('game does not exist')
    }

    const game = this.games.get(pid.game)

    if (game) {
      if (!game.players.some((player) => isSamePid(player.id, pid))) {
        game.players.push({ id: pid, mailbox: [], channel: null })
        console.log(`player created: ${JSON.stringify(pid)}`)
        result.messages.push('player created')
        result.success = true
      } else {
        console.log(`player already exists: ${JSON.stringify(pid)}`)
        result.messages.push('player already exists')
        result.success = false
      }
    }

    return result
  }

  findPlayerBy(searchId: PlayerID): Player | undefined {
    let found: Player | undefined
    for (const gameId of this.games.keys()) {
      found = this.games.get(gameId)?.players.find((p) => p.id === searchId)
      if (found) {
        break
      }
    }
    return found
  }

  status(): Record<any, any> {
    const games: Record<GameID, any> = {}
    this.games.forEach(
      (v, k) => (games[k] = {
        players: v.players.map((p) => ({
          id: p.id,
          mailbox: p.mailbox.length,
        })),
      }),
    )
    return games
  }
}
