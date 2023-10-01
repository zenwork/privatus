import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('prism-heartbeat')
export class PrismHeartbeat extends LitElement {
  @property({ reflect: true, type: Number })
  declare status

  @property({ reflect: true })
  declare msg

  constructor() {
    super()
    this.status = -1
    this.msg = ''
  }

  render(): unknown {
    return html` <sl-badge
      style="font-size:1rem"
      pill
      ?pulse=${this.status === 1}
      variant=${this.status === 1 ? 'primary' : 'neutral'}
      >${this.msg}</sl-badge
    >`
  }
}
