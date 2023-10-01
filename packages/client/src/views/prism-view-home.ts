import { Router } from '@vaadin/router'
import { html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { GameController } from '../controllers/GameController'

@customElement('prism-view-home')
export class PrismViewHome extends LitElement {
  private router!: Router

  @state()
  declare status: string

  onBeforeEnter(location: Router.Location, commands: any, router: Router) {
    this.router = router
    fetch('/api')
      .then(r => r.json())
      .then(s => {
        this.status = s.status
      })
  }

  protected render(): unknown {
    return html`
      <style>
        :host {
          width: 100%;
          display: grid;
        }

        p {
          font-size: 1rem;
        }

        h1 {
          font-size: 15vw;
          margin: 2rem 0 0;
        }

        h2 {
          font-size: 2rem;
        }

        a {
          font-size: 1rem;
        }

        div {
          margin: 0;
        }

        article {
          justify-self: center;
          display: grid;
          grid-template-columns: 1fr;
          grid-gap: 2rem;
          height: 100%;
          max-width: 100%;
        }

        section {
          width: 100%;
        }

        form {
          padding: 0.5rem;
        }

        sl-input {
          display: block;
          margin: 0 auto;
          min-width: 3rem;
          max-width: 20rem;
        }

        sl-select {
          display: block;
          margin: 0 auto;
          width: 20rem;
        }

        sl-button {
          margin: 1rem;
        }

        #home-choices {
          display: flex;
          flex-flow: wrap;
          width: 100vw;
          gap: 3rem;
          max-width: 90rem;
        }

        .home-choice {
          flex-grow: 1;
          flex-shrink: 1;
          padding: 0.5rem;
          min-width: 6rem;
        }
      </style>
      <article>
        <section>
          <h1>PRIVATUS</h1>
        </section>
        <section id="home-choices">
          <div class="home-choice">
            <form
              @submit="${(event: any) => {
                event.preventDefault()
                const data = new FormData(event.target)
                GameController.createGame().then((id: string) =>
                  Router.go(`/game/${id}/${data.get('name')}/PROVIDER`)
                )
              }}"
            >
              <h2>Create a new game</h2>
              <p>Start a new game as provider</p>
              <div class="row2">
                <sl-input name="name" label="name"></sl-input>
                <sl-button type="submit" variant="primary">CREATE</sl-button>
              </div>
            </form>
          </div>
          <div class="home-choice">
            <form
              @submit="${(event: any) => {
                event.preventDefault()
                const data = new FormData(event.target)
                Router.go(
                  `/game/${data.get('code')}/${data.get('name')}/${data.get(
                    'type'
                  )}`
                )
              }}"
            >
              <h2>Join existing game</h2>
              <p>Join a game using the code shared by the provider</p>
              <sl-input
                name="name"
                label="name"
                pattern="[a-zA-Z0-9]{0,10}"
                required
              ></sl-input>
              <div>
                <sl-select id="type" name="type" label="type" required>
                  <sl-option value="ALL">all</sl-option>
                  <sl-option value="CITIZEN">citizen</sl-option>
                  <sl-option value="ISSUER">issuer</sl-option>
                  <sl-option value="PROVIDER" disabled>provider</sl-option>
                  <sl-option value="PROFESSIONAL">professional</sl-option>
                </sl-select>
                <sl-input
                  name="code"
                  label="code"
                  size="small"
                  pattern="[a-zA-Z0-9]{5}"
                  required
                >
                </sl-input>
                <sl-button type="submit" variant="primary">JOIN</sl-button>
              </div>
            </form>
          </div>
          <div class="home-choice">
            <form
              @submit="${(event: any) => {
                event.preventDefault()
                const data = new FormData(event.target)
                const type = (data.get('type') as string) ?? ''
                GameController.createMockGameFor(type).then((id: string) =>
                  Router.go(`/game/${id}/McMock/${type}`)
                )
              }}"
            >
              <h2>Start Mock Game</h2>
              <p>test setup with simulated users</p>
              <div>
                <sl-select
                  id="type"
                  name="type"
                  label="type"
                  value="CITIZEN"
                  required
                >
                  <sl-option value="CITIZEN">citizen</sl-option>
                  <sl-option value="ISSUER">issuer</sl-option>
                  <sl-option value="PROVIDER">provider</sl-option>
                  <sl-option value="PROFESSIONAL">professional</sl-option>
                </sl-select>

                <sl-button type="submit" variant="primary">START</sl-button>
              </div>
            </form>
          </div>
        </section>
        <section>
          <p>server status: ${this.status}</p>
        </section>
      </article>
    `
  }
}
