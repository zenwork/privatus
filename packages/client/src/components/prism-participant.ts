import { consume } from '@lit-labs/context'
import { css, html, LitElement, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import {
  GameID,
  Message,
  MessageType,
  PlayerID,
  PlayerRole,
} from '../../../common/src'
import { key, Registry } from './prism'

@customElement('prism-participant')
export class PrismParticipant extends LitElement {
  static styles = [
    css`
      :host {
      }

      div {
        border: solid 0.1rem #000000;
        /*margin: .2rem;*/
        padding: 0.5rem;
      }
    `,
  ]

  @property({ reflect: true })
  gameId: GameID = ''

  @property()
  playerId = ''

  @property({ type: PlayerRole })
  playerType: PlayerRole = PlayerRole.NONE

  @consume({ context: key, subscribe: true })
  registry: Registry | undefined

  @state()
  hearbeatState = -1

  @state()
  private lastSseMessage = ''

  @state()
  private lastSseMessageOrigin = ''

  private source!: EventSource

  connectedCallback() {
    super.connectedCallback()

    const event = new CustomEvent('prism-register', {
      detail: {
        participant: { pid: this.playerId, ptype: this.playerType },
      },
      bubbles: true,
      composed: true,
    })

    this.dispatchEvent(event)
  }

  private start() {
    const event = new CustomEvent('prism-message', {
      detail: {
        message: this.createStartMessage(),
      },
      bubbles: true,
      composed: true,
    })

    this.dispatchEvent(event)

    fetch(`/api/game/${this.gameId}/${this.playerType}/${this.playerId}`, {
      method: 'PUT',
    }).then(() => {
      this.source = new EventSource(
        `/api/game/${this.gameId}/channel/${this.playerType}/${this.playerId}`
      )
      this.source.onmessage = () => {
        // console.log(event);
      }
      this.source.addEventListener('ping', () => {
        // console.log(this.hearbeatState);
        if (this.hearbeatState === 2) {
          this.hearbeatState = 0
        } else {
          this.hearbeatState++
          // console.log(this.hearbeatState);
        }
      })

      this.source.addEventListener('msg', msg => {
        const data = JSON.parse(msg.data)
        this.lastSseMessage = data.body
        this.lastSseMessageOrigin = data.origin
      })
    })
  }

  private createStartMessage(): Message {
    return {
      type: MessageType.COMMAND,
      body: 'start',
      origin: this.getPlayer(),
      destination: PlayerRole.SERVER,
    }
  }

  private getPlayer(): PlayerID {
    return { key: this.playerId, type: this.playerType }
  }

  updated(changed: PropertyValues<this>) {
    if (changed.has('gameId')) {
      if (this.source) this.source.close()
      if (this.gameId) {
        this.hearbeatState = -1
        this.start()
      } else {
        this.hearbeatState = -1
      }
    }
  }

  render(): unknown {
    return html`
      <div>
        <h3>type:${this.playerType}</h3>
        <h3>id:${this.gameId}-${this.playerId}</h3>
        <prism-heartbeat status="${this.hearbeatState}"></prism-heartbeat>
        <pre>msg:${this.lastSseMessage}</pre>
        <pre>msg origin:${this.lastSseMessageOrigin}</pre>
        <sl-button @click="${this.notify}" ?disabled="${!this.gameId}"
          >message all
        </sl-button>
      </div>
    `
  }

  private notify() {
    if (!this.gameId) return

    const body = `hello! x ${Math.floor(Math.random() * 10)}`

    fetch(`/api/game/${this.gameId}/message/all`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'text',
        body,
        origin: { id: this.id, type: this.playerType },
        destination: 'all',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
