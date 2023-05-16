import { GameID, Message, PlayerID, PlayerRole } from 'common'
import { css, html, LitElement, nothing, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { PlayerController } from '../PlayerController'

@customElement('prism-participant')
export class PrismParticipant extends LitElement {
  private player: PlayerController | null = null

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

  @state()
  hearbeatState = -1

  @state()
  lastSseMessage: Message | undefined

  @state()
  lastSseMessageOrigin: PlayerID | undefined

  connectedCallback() {
    super.connectedCallback()
    this.player = new PlayerController(this, {
      type: this.playerType,
      key: this.playerId,
    })
    if (this.gameId) {
      this.player.openChannel(this.gameId)
    }
  }

  private getPlayer(): PlayerID {
    return { key: this.playerId, type: this.playerType }
  }

  updated(changed: PropertyValues<this>) {
    if (changed.has('gameId') && this.gameId) {
      if (this.player) {
        this.player
          .register(this.gameId)
          .then(() => {
            this.player!.openChannel(this.gameId)
          })
          .catch(() => {
            console.error('registration failed') // eslint-disable-line no-console
          })
      }
    }
  }

  render(): unknown {
    return html`
      <div>
        <h3>type: ${this.playerType}</h3>
        <h3>id : ${this.playerId}</h3>
        <prism-heartbeat status="${this.hearbeatState}"></prism-heartbeat>
        <pre>from:${this.lastSseMessageOrigin?.type}</pre>
        <pre>msg :${this.lastSseMessage}</pre>
        <sl-select id="target" ?disabled="${!this.gameId}">
          <sl-option value="ALL">all</sl-option>
          ${this.playerType === PlayerRole.CITIZEN
            ? nothing
            : html` <sl-option value="CITIZEN">citizen</sl-option>`}
          ${this.playerType === PlayerRole.ISSUER
            ? nothing
            : html` <sl-option value="ISSUER">issuer</sl-option>`}
          ${this.playerType === PlayerRole.PROVIDER
            ? nothing
            : html` <sl-option value="PROVIDER">provider</sl-option>`}
          ${this.playerType === PlayerRole.PROFESSIONAL
            ? nothing
            : html` <sl-option value="PROFESSIONAL">professional</sl-option>`}
        </sl-select>
        <sl-button @click="${this.notify}" ?disabled="${!this.gameId}"
          >send</sl-button
        >
      </div>
    `
  }

  private notify() {
    if (!this.gameId) return

    const element = this.shadowRoot?.querySelector('#target')
    if (element) {
      const target: PlayerRole = <PlayerRole>(
        (element as HTMLSelectElement).value
      )
      const body = `hello ${target} [${Math.floor(Math.random() * 10)}]`

      fetch(`/api/game/${this.gameId}/message`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'text',
          body,
          origin: this.getPlayer(),
          destination: target,
        } as Message),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }
}
