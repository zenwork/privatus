import { css, html, LitElement } from 'lit'
import { Context, ContextProvider } from 'lit-labs/context'
import { customElement, state } from 'lit/decorators.js'
import { key, Registry } from './prism'

@customElement('prism-ctx')
export class PrismCtx extends LitElement {
    static styles = [
        css`
            :host {
            }

            section {
                border: solid .1rem #000000;
                margin: .2rem;
                padding: 1rem
            }

            /*noinspection ALL*/
            #participants {
                display: flex;
                flex-wrap: wrap;
                flex-flow: row wrap;
                justify-content: space-evenly;
                padding: 0;
                margin: 0;
                list-style: none;
            }

            /*noinspection ALL*/
            .participant {
                padding: 5px;
                width: 200px;
                height: 150px;
                margin-top: 10px;
                text-align: center;
                flex-grow: 1;
            }
        `,
    ]

    @state()
    registry: Registry = { p: [] }
    @state()
    gameId = makeid(5)
    @state()
    server = 'UNKNOWN'

    private provider?: ContextProvider<Context<'prism-registry', Registry>>

    constructor() {
        super()
        this.addEventListener('prism-register', (e: any) => {
            this.registry.p.push(e.detail)
            this.registry = { p: this.registry.p }
        })
    }

    connectedCallback() {
        super.connectedCallback()
        this.provider = new ContextProvider(this, key, this.registry)
        fetch('/api').then((r) => r.json()).then((s) => this.server = s.status)
    }

    protected render(): unknown {
        return html`
            <article>
                <section id="header">
                    <h2>Privatus</h2>
                    <h3>The identity and privacy game</h3>
                    <h4># of players: ${this.registry.p.length}</h4>
                    <h4>session: ${this.gameId}</h4>
                </section>
                <section>
                    <ul id="participants">
                        <li class="participant">
                            <prism-participant pid="p1" ptype="CITIZEN" gameid="${this.gameId}"></prism-participant>
                        </li>
                        <li class="participant">
                            <prism-participant pid="p2" ptype="ISSUER" gameid="${this.gameId}"></prism-participant>
                        </li>
                        <li class="participant">
                            <prism-participant pid="p3" ptype="SERVICE_PROVIDER" gameid="${this.gameId}"></prism-participant>
                        </li>
                        <li class="participant">
                            <prism-participant pid="p4" ptype="PROFESSIONAL" gameid="${this.gameId}"></prism-participant>
                        </li>
                    </ul>
                </section>
                <section>
                    status: ${this.server}
                </section>
            </article>`
    }
}

function makeid(length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}
