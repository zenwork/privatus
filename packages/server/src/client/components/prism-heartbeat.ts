import { customElement, property } from 'lit/decorators.js'
import { html, LitElement } from 'lit'

@customElement('prism-heartbeat')
export class PrismHeartbeat extends LitElement {
    @property({ reflect: true, type: Number })
    status = -1

    render(): unknown {
        return html`
            <sl-badge pill ?pulse=${this.status === 0} variant=${this.status === 0 ? 'primary' : 'neutral'}></sl-badge>
            <sl-badge pill ?pulse=${this.status === 1} variant=${this.status === 1 ? 'primary' : 'neutral'}></sl-badge>
            <sl-badge pill ?pulse=${this.status === 2} variant=${this.status === 2 ? 'primary' : 'neutral'}></sl-badge>`
    }
}
