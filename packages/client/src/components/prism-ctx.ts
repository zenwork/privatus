import { Context, ContextProvider, provide } from '@lit-labs/context'
import { Router } from '@vaadin/router'
import { GameID, Message, PlayerRole } from 'common'
import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { GameController } from '../controllers/GameController'
import { key, messageKey, Registry } from './prism'

@customElement('prism-ctx')
export class PrismCtx extends LitElement {
  private game = new GameController(this)

  @property({ converter: value => value?.split(',').map(v => <PlayerRole>v) })
  declare players: { id: string; role: PlayerRole }[]

  @state()
  declare registry: Registry

  @provide({ context: messageKey })
  @state()
  declare message: Message | undefined

  @state()
  declare gameId: GameID

  private provider?: ContextProvider<Context<'prism-registry', Registry>>

  constructor() {
    super()
    this.players = [
      // PlayerRole.CITIZEN,
      // PlayerRole.ISSUER,
      // { id: 'p1', role: PlayerRole.PROVIDER }
      // PlayerRole.PROFESSIONAL,
    ]
    this.registry = { p: [] }
    this.gameId = ''

    this.addEventListener('prism-register', (e: any) => {
      this.registry.p.push(e.detail)
      this.registry = { p: this.registry.p }
    })
  }

  connectedCallback() {
    super.connectedCallback()
    this.provider = new ContextProvider(this, key, this.registry)
  }

  /**
   * Vaadin Router life-cycle call
   */
  onBeforeEnter(location: Router.Location) {
    if (location.params.id) {
      this.gameId = location.params.id as GameID
    }

    if (location.params.player) {
      this.players = [
        {
          id: location.params.player as string,
          role: location.params.role as PlayerRole,
        },
      ]
    }
  }

  protected render(): unknown {
    return html` <article>
      <section id="header">
        <h2>Privatus</h2>
        <h4>game: ${this.gameId}</h4>
      </section>
      <section>
        <ul id="participants">
          ${this.players.map(
            p => html`
              <li class="participant">
                <prism-participant
                  playerid="${p.id}"
                  playertype="${p.role}"
                  gameid="${this.gameId}"
                ></prism-participant>
              </li>
            `
          )}
        </ul>
      </section>
    </article>`
  }

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
}
