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
    @state()
    private lastMsg = ''
    @state()
    private lastMsgOrigin = ''

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
        fetch(`/api/game/${this.gameid}/${this.ptype}/${this.pid}`, { method: 'PUT' }).then(() => {
            this.source = new EventSource(`/api/game/${this.gameid}/channel/${this.ptype}/${this.pid}`)
            this.source.onmessage = (event) => {
                console.log(event)
            }
            this.source.addEventListener(
                'ping',
                () => {
                    // console.log('ping', e)
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

            this.source.addEventListener(
                'msg',
                (msg) => {
                    const data = JSON.parse(msg.data)
                    this.lastMsg = data.body
                    this.lastMsgOrigin = data.origin
                },
            )
        })
    }

    updated(changed: PropertyValues<this>) {
        if (changed.has('gameid') && this.gameid) {
            this.connected = '...'
            if (this.source) this.source.close()
            this.start()
        } else if (changed.has('gameid') && !this.gameid) {
            this.connected = '!!!'
            if (this.source) this.source.close()
        }
    }

    render(): unknown {
        return html`
            <div>
                <h3>type:${this.ptype}</h3>
                <h3>id:${this.gameid}-${this.pid}</h3>
                <pre>${this.connected}</pre>
                <pre>msg:${this.lastMsg}</pre>
                <pre>msg origin:${this.lastMsgOrigin}</pre>
                <button @click=${this.notify}>message all
                </button>

            </div>
        `
    }

    private notify() {
        if (!this.gameid) return

        const body = `hello! x ${Math.floor(Math.random() * 10)}`

        fetch(`/api/game/${this.gameid}/message/all`, {
            method: 'POST',
            body: JSON.stringify({ type: 'text', body, origin: this.ptype }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}
