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
    }

    this.source.onerror = ev => {
      if (
        this.state === PlayerLifecycle.CONNECTED ||
        this.state === PlayerLifecycle.DISCONNECTING
      ) {
        console.error('error', ev) // eslint-disable-line no-console
        this.setState(PlayerLifecycle.DISCONNECTED)
      }
    }

    this.source.addEventListener('ping', () => {
      if (this.host.hearbeatState !== 1) {
        this.host.hearbeatState = 1
      } else {
        this.host.hearbeatState = 1
      }
    })

    this.source.addEventListener('msg', msg => {
      const message = JSON.parse(msg.data) as Message

      if (message.body === 'ending game') {
        this.host.pid = { ...this.host.pid, game: NONE }
        this.source?.close()
        this.setState(PlayerLifecycle.DISCONNECTED)
      } else {
        this.host.lastSseMessage.push({ date: new Date(), msg: message })
        this.host.requestUpdate('lastSseMessage')
      }
    })
  }

  closeChannel() {
    if (this.state !== PlayerLifecycle.CONNECTED) return
    if (this.source) this.source.close()
  }

  async sendMessage(
    msg: string,
    target: PlayerRole
  ): Promise<Message | undefined> {
    if (this.state !== PlayerLifecycle.CONNECTED) return undefined

    const body = msg
    const { game } = this.host.pid

    const message = {
      type: 'text',
      body,
      origin: this.host.pid,
      destination: target,
    } as Message
    await fetch(`/api/game/${game}/message`, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return message
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
    }
  }

  hostConnected(): void {}

  hostDisconnected(): void {}

  hostUpdated(): void {}
}
