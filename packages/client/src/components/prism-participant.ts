import { GameID, Message, PlayerID, PlayerRole } from 'common'
import { css, html, LitElement, nothing, PropertyValues } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { NONE } from '../controllers'
import { PlayerController } from '../controllers/PlayerController'

@customElement('prism-participant')
export class PrismParticipant extends LitElement {
  @property({ reflect: true, converter: value => (!value ? NONE : value) })
  declare gameId: GameID

  @property()
  declare playerId

  @property({ type: PlayerRole })
  declare playerType: PlayerRole

  @state()
  declare hearbeatState

  @state()
  declare lastSseMessage: { date: Date; msg: Message }[]

  declare player: PlayerController

  @state()
  declare pid: PlayerID

  @query('#target')
  declare target: HTMLSelectElement | null | undefined

  @state()
  declare state: string

  constructor() {
    super()
    this.player = new PlayerController(this)
    this.playerId = NONE
    this.gameId = NONE
    this.playerType = PlayerRole.NONE
    this.hearbeatState = -1
    this.pid = { game: NONE, key: NONE, type: PlayerRole.NONE }
    this.state = ''
    this.lastSseMessage = []
  }

  render(): unknown {
    return html`
      <div id="participant">
        <h3>${this.playerId}</h3>
        <h4>${this.playerType}</h4>

        <prism-heartbeat
          status="${this.hearbeatState}"
          msg="${this.state[0]}"
        ></prism-heartbeat>
      </div>
      <div id="log">
        <ul>
          ${this.lastSseMessage.map(
            m => html` <li>
              ${m.date.toISOString().substring(11, 19)}:
              ${String(m.msg.origin.type).padEnd(20)}: ${m.msg.body}
            </li>`
          )}
        </ul>
      </div>
      <div id="form">
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

  static styles = [
    css`
      :host {
        max-height: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: min-content auto min-content;
        border: solid 0.1rem #000000;
        padding: 0.5rem;
      }

      #participant {
        height: 2rem;
        display: grid;
        grid-template-columns: 10fr 5fr 1fr;
        padding: 0.5rem;
      }

      #log {
        align-self: stretch;
        justify-self: stretch;
        overflow-y: scroll;
      }

      #form {
        height: 5rem;
      }

      h3 {
        font-size: 0.9rem;
        justify-self: start;
      }

      h4 {
        font-size: 0.9rem;
        justify-self: end;
      }

      prism-heartbeat {
        justify-self: end;
      }

      h3,
      h4,
      prism-heartbeat {
        align-self: center;
        margin: 0;
        padding: 0;
      }

      ul {
        list-style: none;
        overflow: auto;
      }

      li {
        justify-self: start;
      }
    `,
  ]

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
