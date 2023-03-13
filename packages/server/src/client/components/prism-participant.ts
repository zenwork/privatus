import { css, html, LitElement, state } from 'lit'
import { consume } from 'lit-labs/context'
import { customElement, property } from 'lit/decorators.js'
import { key, Registry } from './prism'

export enum PType {
    CITIZEN = 'CITIZEN',
    SERVICE_PROVIDER = 'SERVICE PROVIDER',
    PROFESSIONAL = 'PROFESSIONAL',
    ISSUER = 'ISSUER',
    UNDEFINED = 'UNDEFINED',
}

@customElement('prism-participant')
export class PrismParticipant extends LitElement {
    static styles = [
        css`
            :host {

            }

            div {
                border: solid .1rem #000000;
                /*margin: .2rem;*/
                padding: .5rem;
            }
        `,
    ]
    @property()
    pid = ''
    @property()
    ptype: PType = PType.UNDEFINED
    @property({ reflect: true })
    gameid = ''
    @consume({ context: key, subscribe: true })
    registry: Registry | undefined
    @state()
    connected = '...'
    private source: EventSource

    connectedCallback() {
        super.connectedCallback()
        const event = new CustomEvent('prism-register', {
            detail: {
                participant: { pid: this.pid, ptype: this.ptype },
            },
            bubbles: true,
            composed: true,
        })

        this.dispatchEvent(event)
    }

    private start() {
        this.source = new EventSource(`/api/status/${this.gameid}/${this.pid}/${this.ptype}`)
        this.source.addEventListener(
            `ping`,
            () => {
                switch (this.connected.indexOf('*')) {
                    case -1:
                        this.connected = '*--'
                        break
                    case 0:
                        this.connected = '-*-'
                        break
                    case 1:
                        this.connected = '--*'
                        break
                    case 2:
                        this.connected = '*--'
                        break
                }
            },
        )
    }

    updated(changed: PropertyValues<this>) {
        if (changed.has('gameid') && this.gameid) {
            this.connected = '...'
            if (this.source) this.source.close()
            this.start()
        }
    }

    render(): unknown {
        return html`
            <div>
                <h3>type:${this.ptype}</h3>
                <h3>id:${this.gameid}-${this.pid}</h3>
                <pre>${this.connected}</pre>

            </div>
        `
    }
}
