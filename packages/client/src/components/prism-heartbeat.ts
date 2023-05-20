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
        pill
        ?pulse=${this.status === 0}
        variant=${this.status === 0 ? 'primary' : 'neutral'}
      ></sl-badge>
      <sl-badge
        style="font-size:2rem"
        pill
        ?pulse=${this.status === 1}
        variant=${this.status === 1 ? 'primary' : 'neutral'}
        >${this.msg}</sl-badge
      >
      <sl-badge
        pill
        ?pulse=${this.status === 2}
        variant=${this.status === 2 ? 'primary' : 'neutral'}
      ></sl-badge>`
  }
}
