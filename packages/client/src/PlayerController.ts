import { Message, PlayerRole, Result } from 'common'
import { ReactiveController } from 'lit'
import { PrismParticipant } from './components/prism-participant'

export const NONE = 'NONE'

enum Lifecycle {
  STOPPED = 'STOPPED',
  REGISTER = 'REGISTER',
  REGISTERED = 'REGISTERED',
  CONNECT = 'CONNECT',
  CONNECTED = 'CONNECTED',
  DISCONNECTING = 'DISCONNECTING',
  DISCONNECTED = 'DISCONNECTED',
}

export class PlayerController implements ReactiveController {
  private host: PrismParticipant

  private source: EventSource | null

  private state: Lifecycle = Lifecycle.STOPPED

  constructor(host: PrismParticipant) {
    this.host = host
    this.host.addController(this)
    this.source = null
  }

  join() {
    const { game, key, type } = this.host.pid
    return fetch(`/api/game/${game}/${type}/${key}`, {
      method: 'PUT',
    })
      .then(r => r.json())
      .then((j: Result) => {
        this.state = Lifecycle.REGISTERED
        return j.success
      })
      .catch(() => false)
  }

  openChannel() {
    if (this.state !== Lifecycle.REGISTERED) {
      return
    }

    const { game, key, type } = this.host.pid
    this.closeChannel()
    this.state = Lifecycle.CONNECT
    this.source = new EventSource(`/api/game/${game}/channel/${type}/${key}`)

    this.source.onmessage = event => {
      console.log(event) // eslint-disable-line no-console
    }

    this.source.onopen = () => {
      this.state = Lifecycle.CONNECTED
      this.host.requestUpdate()
    }

    this.source.onerror = () => {
      this.state = Lifecycle.DISCONNECTED
      this.host.requestUpdate()
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

      if (data.body === 'ending game') {
        this.state = Lifecycle.DISCONNECTING
        this.closeChannel()
      } else {
        this.host.lastSseMessage = data.body
        this.host.lastSseMessageOrigin = data.origin
      }
      this.host.requestUpdate()
    })
  }

  closeChannel() {
    if (this.state !== Lifecycle.CONNECTED) {
      return
    }

    if (this.source) this.source.close()
  }

  sendMessage(msg: string, target: PlayerRole) {
    if (this.state !== Lifecycle.CONNECTED) return

    const body = msg
    const { game } = this.host.pid

    fetch(`/api/game/${game}/message`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'text',
        body,
        origin: this.host.pid,
        destination: target,
      } as Message),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  hostConnected(): void {}

  hostDisconnected(): void {}

  hostUpdated(): void {}

  hostUpdate(): void {
    if (this.state === Lifecycle.STOPPED) {
      const { game, key, type } = this.host.pid
      if (game !== NONE && key !== NONE && type !== PlayerRole.NONE) {
        this.state = Lifecycle.REGISTER
        this.join()
          .then(() => {
            this.openChannel()
          })
          .catch(() => {
            console.error('registration failed') // eslint-disable-line no-console
          })
      }
    }

    if (this.state === Lifecycle.DISCONNECTED) {
      this.state = Lifecycle.STOPPED
      this.host.hearbeatState = -1
      this.host.requestUpdate()
    }
  }
}
