import { Message, PlayerRole, Result } from 'common'
import { ReactiveController } from 'lit'
import { PrismParticipant } from './components/prism-participant'

export const NONE = 'NONE'

enum Lifecycle {
  STOPPED = 'STOPPED',
  REGISTERING = 'REGISTERING',
  REGISTERED = 'REGISTERED',
  CONNECTING = 'CONNECTING',
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
        this.setState(Lifecycle.REGISTERED)
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
    this.setState(Lifecycle.CONNECTING)
    this.source = new EventSource(`/api/game/${game}/channel/${type}/${key}`)

    this.source.onmessage = event => {
      console.log(event) // eslint-disable-line no-console
    }

    this.source.onopen = () => {
      this.setState(Lifecycle.CONNECTED)
      this.host.requestUpdate()
    }

    this.source.onerror = ev => {
      if (
        this.state === Lifecycle.CONNECTED ||
        this.state === Lifecycle.DISCONNECTING
      ) {
        console.log('error', ev)
        this.setState(Lifecycle.DISCONNECTED)
        this.host.requestUpdate()
      }
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
        this.host.pid = { ...this.host.pid, game: NONE }
        this.source?.close()
        this.setState(Lifecycle.DISCONNECTED)
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

  setState(state: Lifecycle) {
    this.state = state
    this.host.state = this.state
    this.host.requestUpdate()
  }

  hostConnected(): void {}

  hostDisconnected(): void {}

  hostUpdated(): void {}

  hostUpdate(): void {
    if (this.state === Lifecycle.STOPPED) {
      const { game, key, type } = this.host.pid
      if (
        this.host.hearbeatState === -1 &&
        game !== NONE &&
        key !== NONE &&
        type !== PlayerRole.NONE
      ) {
        this.setState(Lifecycle.REGISTERING)
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
      this.setState(Lifecycle.STOPPED)
      this.host.hearbeatState = -1
      this.host.pid = { ...this.host.pid, game: NONE }
      this.host.requestUpdate()
    }
  }
}
