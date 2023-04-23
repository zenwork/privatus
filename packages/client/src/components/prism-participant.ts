import { consume } from '@lit-labs/context'
import { css, html, LitElement, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
// @ts-ignore
import { Message, MessageType } from '../../../common/messages.ts'
// @ts-ignore
import { GameID, PlayerID, PlayerRole } from '../../../common/players.ts'
import { key, messageKey, Registry } from './prism'

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

  @consume({ context: messageKey, subscribe: true })
  @state()
  lastSseMessage: Message | undefined

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
