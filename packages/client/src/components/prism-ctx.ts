import { Context, ContextProvider, provide } from '@lit-labs/context'
import { Message, PlayerRole } from 'common'
import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { GameController } from '../controllers/GameController'
import { key, messageKey, Registry } from './prism'

@customElement('prism-ctx')
export class PrismCtx extends LitElement {
  private game = new GameController(this)

  static styles = [
    css`
      :host {
      }

      section {
        border: solid 0.1rem #000000;
        margin: 0.2rem;
        padding: 1rem;
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
        width: 20rem;
        min-width: 10rem;
        margin-top: 10px;
        text-align: center;
        flex-grow: 1;
      }
    `,
  ]

  @property({ converter: value => value?.split(',').map(v => <PlayerRole>v) })
  declare players: PlayerRole[]

  @state()
  declare registry: Registry

  @provide({ context: messageKey })
  @state()
  declare message: Message | undefined

  @state()
  declare gameId

  @state()
  declare server

  private provider?: ContextProvider<Context<'prism-registry', Registry>>

  constructor() {
    super()
    this.players = [
      PlayerRole.CITIZEN,
      PlayerRole.ISSUER,
      PlayerRole.PROVIDER,
      PlayerRole.PROFESSIONAL,
    ]
    this.registry = { p: [] }
    this.gameId = ''
    this.server = 'UNKNOWN'

    this.addEventListener('prism-register', (e: any) => {
      this.registry.p.push(e.detail)
      this.registry = { p: this.registry.p }
    })
  }

  connectedCallback() {
    super.connectedCallback()

    const { searchParams } = new URL(window.location.toString())

    if (searchParams.has('g')) {
      this.gameId = searchParams.get('g')!
    }

    this.provider = new ContextProvider(this, key, this.registry)
    fetch('/api')
      .then(r => r.json())
      .then(s => {
        this.server = s.status
      })
  }

  protected render(): unknown {
    return html` <article>
      <section id="header">
        <h2>Privatus</h2>
        <h3>PRivacy & Identity SiMulator (PRISM)</h3>
        <h4># of players: ${this.registry.p.length}</h4>
        <h4>session: ${this.gameId}</h4>
        <sl-button
          @click="${() => this.game.newGame()}"
          ?disabled=${this.gameId}
          >start</sl-button
        >
        <sl-button @click="${() => this.game.endGame()}">stop</sl-button>
      </section>
      <section>
        <ul id="participants">
          ${this.players.map(
            p => html`
              <li class="participant">
                <prism-participant
                  playerid="${p}"
                  playertype="${p}"
                  gameid="${this.gameId}"
                ></prism-participant>
              </li>
            `
          )}
        </ul>
      </section>
      <section>status: ${this.server}</section>
    </article>`
  }
}
