import { GameID, Message, PlayerID, PlayerRole } from 'common'
import { css, html, LitElement, nothing, PropertyValues } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { NONE, PlayerController } from '../PlayerController'

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

  @property({ reflect: true, converter: value => (!value ? NONE : value) })
  gameId: GameID = NONE

  @property()
  playerId = NONE

  @property({ type: PlayerRole })
  playerType: PlayerRole = PlayerRole.NONE

  @state()
  hearbeatState = -1

  @state()
  lastSseMessage: Message | undefined

  @state()
  lastSseMessageOrigin: PlayerID | undefined

  player: PlayerController

  @state()
  pid: PlayerID = { game: NONE, key: NONE, type: PlayerRole.NONE }

  @query('#target')
  target: HTMLSelectElement | null | undefined

  @state()
  state: string = ''

  constructor() {
    super()
    this.player = new PlayerController(this)
  }

  render(): unknown {
    return html`
      <div>
        <h3>type: ${this.playerType}</h3>
        <h3>id : ${this.playerId}</h3>

        <prism-heartbeat
          status="${this.hearbeatState}"
          msg="${this.state}"
        ></prism-heartbeat>
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
        <sl-button
          @click="${this.send}"
          ?disabled="${this.gameId === NONE || this.target?.value === ''}"
          >send
        </sl-button>
      </div>
    `
  }

  send() {
    if (this.target) {
      const target: PlayerRole = <PlayerRole>this.target.value
      this.player.sendMessage(
        `hello ${target} [${Math.floor(Math.random() * 10)}]`,
        target
      )
    }
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties)
    if (
      changedProperties.has('gameId') ||
      changedProperties.has('playerId') ||
      changedProperties.has('playerType')
    ) {
      this.pid = {
        game: this.gameId,
        key: this.playerId,
        type: this.playerType,
      }
    }
  }
}
