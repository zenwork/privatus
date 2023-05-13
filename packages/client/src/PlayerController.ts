import { PlayerID, Result } from 'common'
import { ReactiveController } from 'lit'
import { PrismParticipant } from './components/prism-participant'

export class PlayerController implements ReactiveController {
  host: PrismParticipant

  source: EventSource | null

  id: PlayerID

  constructor(host: PrismParticipant, id: PlayerID) {
    this.host = host
    this.host.addController(this)
    this.source = null
    this.id = id
  }

  register(gameId: string) {
    return fetch(`/api/game/${gameId}/${this.id.type}/${this.id.key}`, {
      method: 'PUT',
    })
      .then(r => r.json())
      .then((j: Result) => {
        this.host.requestUpdate()
        return j.success
      })
      .catch(() => false)
  }

  openChannel(gameId: string) {
    this.closeChannel()

    this.source = new EventSource(
      `/api/game/${gameId}/channel/${this.id.type}/${this.id.key}`
    )

    this.source.onmessage = event => {
      console.log(event) // eslint-disable-line no-console
    }

    this.source.addEventListener('ping', () => {
      if (this.host.hearbeatState !== 2) {
        this.host.hearbeatState++
      } else {
        this.host.hearbeatState = 0
      }
      this.host.requestUpdate()
    })

    this.source.addEventListener('msg', msg => {
      const data = JSON.parse(msg.data)
      this.host.lastSseMessage = data.body
      this.host.lastSseMessageOrigin = data.origin
      this.host.requestUpdate()
    })
  }

  closeChannel() {
    if (this.source) this.source.close()
    this.host.hearbeatState = -1
  }

  hostConnected(): void {}

  hostDisconnected(): void {}

  hostUpdate(): void {}

  hostUpdated(): void {}
}
