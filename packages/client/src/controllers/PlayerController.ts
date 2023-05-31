import { Message, PlayerRole, Result } from 'common'
import { ReactiveController } from 'lit'
import { PrismParticipant } from '../components/prism-participant'
import { NONE, PlayerLifecycle } from './index'

export class PlayerController implements ReactiveController {
  private host: PrismParticipant

  private source: EventSource | null

  private state: PlayerLifecycle = PlayerLifecycle.STOPPED

  constructor(host: PrismParticipant) {
    this.host = host
    this.host.addController(this)
    this.source = null
  }

  setState(state: PlayerLifecycle) {
    this.state = state
    this.host.state = this.state
    this.host.requestUpdate()
  }

  join() {
    const { game, key, type } = this.host.pid
    return fetch(`/api/game/${game}/${type}/${key}`, {
      method: 'PUT',
    })
      .then(r => r.json())
      .then((j: Result) => {
        this.setState(PlayerLifecycle.REGISTERED)
        return j.success
      })
      .catch(() => false)
  }

  openChannel() {
    if (this.state !== PlayerLifecycle.REGISTERED) {
      return
    }

    const { game, key, type } = this.host.pid
    this.closeChannel()
    this.setState(PlayerLifecycle.CONNECTING)
    this.source = new EventSource(`/api/game/${game}/channel/${type}/${key}`)

    this.source.onmessage = event => {
      console.log(event) // eslint-disable-line no-console
    }

    this.source.onopen = () => {
      this.setState(PlayerLifecycle.CONNECTED)
      this.host.requestUpdate()
    }

    this.source.onerror = ev => {
      if (
        this.state === PlayerLifecycle.CONNECTED ||
        this.state === PlayerLifecycle.DISCONNECTING
      ) {
        console.log('error', ev) // eslint-disable-line no-console
        this.setState(PlayerLifecycle.DISCONNECTED)
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
        this.setState(PlayerLifecycle.DISCONNECTED)
      } else {
        this.host.lastSseMessage = data.body
        this.host.lastSseMessageOrigin = data.origin
      }
      this.host.requestUpdate()
    })
  }

  closeChannel() {
    if (this.state !== PlayerLifecycle.CONNECTED) return
    if (this.source) this.source.close()
  }

  sendMessage(msg: string, target: PlayerRole) {
    if (this.state !== PlayerLifecycle.CONNECTED) return

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

  hostUpdate(): void {
    if (this.state === PlayerLifecycle.STOPPED) {
      const { game, key, type } = this.host.pid
      if (
        this.host.hearbeatState === -1 &&
        game !== NONE &&
        key !== NONE &&
        type !== PlayerRole.NONE
      ) {
        this.setState(PlayerLifecycle.REGISTERING)
        this.join()
          .then(() => {
            this.openChannel()
          })
          .catch(() => {
            console.error('registration failed') // eslint-disable-line no-console
          })
      }
    }

    if (this.state === PlayerLifecycle.DISCONNECTED) {
      this.setState(PlayerLifecycle.STOPPED)
      this.host.hearbeatState = -1
      this.host.pid = { ...this.host.pid, game: NONE }
      this.host.requestUpdate()
    }
  }

  hostConnected(): void {}

  hostDisconnected(): void {}

  hostUpdated(): void {}
}