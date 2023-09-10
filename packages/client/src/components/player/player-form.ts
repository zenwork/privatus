import { PlayerID, PlayerRole } from 'common'
import { css, html, LitElement, nothing } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { NONE } from '../../controllers'

@customElement('prism-player-form')
export class PrismPlayerForm extends LitElement {
  @property()
  declare player: PlayerID

  @query('#target')
  declare target: HTMLSelectElement | null | undefined

  constructor() {
    super()
    this.player = { game: '', key: '', type: PlayerRole.NONE }
  }

  protected render(): unknown {
    return html` <sl-select
        id="target"
        @click="${() => this.requestUpdate()}"
        ?disabled="${!this.player.game}"
      >
        <sl-option value="ALL">all</sl-option>
        ${this.player.type === PlayerRole.CITIZEN
          ? nothing
          : html` <sl-option value="CITIZEN">citizen</sl-option>`}
        ${this.player.type === PlayerRole.ISSUER
          ? nothing
          : html` <sl-option value="ISSUER">issuer</sl-option>`}
        ${this.player.type === PlayerRole.PROVIDER
          ? nothing
          : html` <sl-option value="PROVIDER">provider</sl-option>`}
        ${this.player.type === PlayerRole.PROFESSIONAL
          ? nothing
          : html` <sl-option value="PROFESSIONAL">professional</sl-option>`}
      </sl-select>
      <sl-button
        @click="${this.send}"
        ?disabled="${this.player.game === NONE || this.target?.value === ''}"
        >send
      </sl-button>`
  }

  static styles = [
    css`
      :host {
        height: 5rem;
      }
    `,
  ]

  send() {
    if (this.target) {
      const target: PlayerRole = <PlayerRole>this.target.value
      const event = new CustomEvent('send', {
        detail: {
          message: `hello ${target} [${Math.floor(Math.random() * 10)}]`,
          target,
        },
        composed: true,
        bubbles: true,
        cancelable: true,
      })
      this.dispatchEvent(event)
    }
  }
}
