import { ReactiveController } from 'lit'
import { Message }            from 'common'
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

  // openChannel(playerId: PlayerID) {
  //
  //   const source = new EventSource(
  //     `/api/game/${this.gameId}/channel/${this.playerType}/${this.playerId}`
  //   )
  //
  //   source.onmessage = () => {
  //     console.log(event);
  // }
  // source.addEventListener('ping', (ping) => {
  //   this.host.message =
  // })
  //
  // source.addEventListener('msg', msg => {
  //   const data = JSON.parse(msg.data)
  //   this.lastSseMessage = data.body
  //   this.lastSseMessageOrigin = data.origin
  // })
  //
  // }

  hostConnected(): void {}

  hostDisconnected(): void {}

  hostUpdate(): void {}

  hostUpdated(): void {}

  sendMessage(message: Message) {
    // eslint-disable-next-line no-console
    console.log(message)
  }
}
