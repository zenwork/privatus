import { ReactiveController } from 'lit'
import { PrismCtx } from './components/prism-ctx'

export class GameController implements ReactiveController {
  host: PrismCtx

  id = ''

  constructor(host: PrismCtx) {
    this.host = host
    this.host.addController(this)
  }

  newGame() {
    return fetch('/api/game', { method: 'POST' })
      .then(r => r.json())
      .then(j => {
        this.id = j.gameId
        this.host.gameId = this.id
        this.host.requestUpdate()
        return true
      })
      .catch(() => false)
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
