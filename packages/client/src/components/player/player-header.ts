import { PlayerID } from 'common'
import { css, html, LitElement } from 'lit'
import { property, state, customElement } from 'lit/decorators.js'
import { PlayerLifecycle } from '../../controllers'

@customElement('prism-player-header')
export class PrismPlayerHeader extends LitElement {
  @property()
  declare player: PlayerID

  @state()
  declare heartbeat: { id: number; state: PlayerLifecycle }

  protected render(): unknown {
    return html`
      <h3>${this.player.key}</h3>
      <h4>${this.player.type}</h4>

      <prism-heartbeat
        status="${this.heartbeat.id}"
        msg="${this.heartbeat.state[0]}"
      ></prism-heartbeat>
    `
  }

  static styles = [
    css`
      :host {
        height: 2rem;
        display: grid;
        grid-template-columns: 10fr 5fr 1fr;
        padding: 0.5rem;
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
    `,
  ]
}
