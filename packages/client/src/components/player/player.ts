import { GameID, Message, PlayerID, PlayerRole } from 'common'
import { css, html, LitElement, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { NONE, PlayerLifecycle } from '../../controllers'
import { PlayerController } from '../../controllers/PlayerController'

@customElement('prism-player')
export class PrismPlayer extends LitElement {
  @property({ reflect: true, converter: value => (!value ? NONE : value) })
  declare gameId: GameID

  @property()
  declare playerId: string

  @property({ type: PlayerRole })
  declare playerType: PlayerRole

  declare player: PlayerController

  @state()
  declare pid: PlayerID

  @state()
  declare heartbeat: { id: number; state: PlayerLifecycle }

  @state()
  declare lastSseMessage: { date: Date; msg: Message }[]

  constructor() {
    super()
    this.gameId = NONE
    this.player = new PlayerController(this)
    this.heartbeat = { id: -1, state: PlayerLifecycle.STOPPED }
    this.pid = { game: NONE, key: NONE, type: PlayerRole.NONE }
    this.lastSseMessage = []
  }

  render(): unknown {
    return html`
      <prism-player-header
        .player="${this.pid}"
        .heartbeat="${this.heartbeat}"
      ></prism-player-header>
      <div id="log">
        <ul>
          ${this.lastSseMessage.map(m => {
            if (this.isMe(m)) {
              return html` <prism-player-chat-bubble
                .date=${m.date}
                name="${String(m.msg.destination)}"
                me
              >
                ${m.msg.body}
              </prism-player-chat-bubble>`
            }
            return html` <prism-player-chat-bubble
              .date=${m.date}
              name="${String(m.msg.origin.type)}"
            >
              ${m.msg.body}
            </prism-player-chat-bubble>`
          })}
        </ul>
      </div>
      <prism-player-form
        .player="${this.pid}"
        @send="${(evt: CustomEvent) => this.send(evt.detail)}"
      ></prism-player-form>
    `
  }

  private isMe(m: { date: Date; msg: Message }) {
    return m.msg.origin.key === this.pid.key
  }

  static styles = [
    css`
      :host {
        max-height: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: min-content auto min-content;
        border: solid 0.1rem #000000;
        border-radius: 1rem;
        padding: 0.5rem;
      }

      #log {
        align-self: stretch;
        justify-self: stretch;
        overflow-y: scroll;
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

  send(event: { message: string; target: PlayerRole }) {
    this.player.sendMessage(event.message, event.target).then(msg => {
      if (msg) {
        this.lastSseMessage.push({ date: new Date(), msg })
        this.requestUpdate('lastSseMessage')
      }
    })
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
