import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

import './components/index.js'
import { NavigationController } from './controllers/NavigationController'

// const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

@customElement('prism-app')
export class PrismApp extends LitElement {
  private navigation

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--prism-app-background-color);
    }

    main {
      flex-grow: 1;
    }

    .logo {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `

  constructor() {
    super()
    this.navigation = new NavigationController(this)
  }

  render() {
    return html`
      <main>
        <prism-ctx></prism-ctx>
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >open-wc</a
        >.
      </p>
    `
  }
}
