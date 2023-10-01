import { provide } from '@lit-labs/context'
import { Router } from '@vaadin/router'
import { GameID, Message, PlayerRole } from 'common'
import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { messageKey, Registry } from './prism'

@customElement('prism-ctx')
export class PrismCtx extends LitElement {
  @property({ converter: value => value?.split(',').map(v => <PlayerRole>v) })
  declare players: { id: string; role: PlayerRole }[]

  @state()
  declare registry: Registry

  @provide({ context: messageKey })
  @state()
  declare message: Message | undefined

  @state()
  declare gameId: GameID

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
        <h1>PRIVATUS</h1>
        <h2>GAME: ${this.gameId}</h2>
      </section>
      <section id="body">
        ${this.players.map(
          p => html`
            <prism-player
              playerid="${p.id}"
              playertype="${p.role}"
              gameid="${this.gameId}"
            ></prism-player>
          `
        )}
      </section>
    </article>`
  }

  static styles = [
    css`
      :host {
        display: grid;
      }

      article {
        justify-self: center;
        width: 95vw;
        height: 100vh;
        max-height: 100vh;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 2rem calc(100vh - 2.6rem);
      }

      section {
        /*border: solid 0.1rem #000000;*/
        margin: 0.2rem;
        padding: 0.1rem;
      }

      prism-player {
        height: 100%;
        margin: 0;
        padding: 0;
      }

      #header {
        display: grid;
        grid-template-columns: 2fr 1fr;
        padding-left: 1rem;
        padding-right: 1rem;
      }

      #body {
      }

      h1 {
        justify-self: start;
      }

      h2 {
        justify-self: end;
      }

      h1,
      h2 {
        font-size: 1rem;
        align-self: end;
        margin: 0;
        padding: 0;
      }
    `,
  ]
}
