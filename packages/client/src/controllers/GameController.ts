import { ReactiveController } from 'lit'
import { GameID } from '../../../common'
import { PrismCtx } from '../components/prism-ctx'

export class GameController implements ReactiveController {
  host: PrismCtx

  id: GameID = ''

  constructor(host: PrismCtx) {
    this.host = host
    this.host.addController(this)
  }

  newGame(): Promise<GameID> {
    return GameController.createGame().then(gameId => {
      this.id = gameId
      this.host.gameId = this.id
      this.host.requestUpdate()
      return this.id
    })
  }

  static createGame(): Promise<string> {
    return fetch('/api/game', { method: 'POST' })
      .then(response => response.json())
      .then((json: Record<any, any>) => json.gameId)
      .catch(() => '')
  }

  endGame() {
    return fetch(`/api/game/${this.id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(j => {
        if (j.messages[0] === 'game ended') {
          this.id = ''
          this.host.gameId = this.id
          this.host.requestUpdate()
          return true
        }
        return false
      })
      .catch(() => false)
  }

  hostConnected(): void {}

  hostDisconnected(): void {}

  hostUpdate(): void {}

  hostUpdated(): void {}
}
