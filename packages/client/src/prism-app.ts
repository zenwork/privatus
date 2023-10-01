import { Router } from '@vaadin/router'
import { css, html, LitElement, render } from 'lit'
import { customElement } from 'lit/decorators.js'

import { http404 } from './http404'
import './components/index'
import './views/index'

@customElement('prism-app')
export class PrismApp extends LitElement {
  firstUpdated() {
    const outlet = this.shadowRoot?.querySelector('.main')
    const router = new Router(outlet)

    router.setRoutes([
      { path: '/', component: 'prism-view-home' },
      { path: '/game/:id/:player/:role', component: 'prism-ctx' },
      { path: '/game/:id', component: 'prism-ctx' },
      { path: '(.*)', action: this.wrap(http404()) },
    ])
  }

  wrap(template: any) {
    return (context: any, commands: any) => {
      const stubElement: HTMLDivElement = commands.component('div')
      stubElement.style.height = '100%'
      stubElement.style.display = 'block'
      stubElement.style.margin = '0'
      stubElement.style.padding = '0'
      render(template, stubElement)
      return stubElement
    }
  }

  render = () => html`<main class="main"></main>`

  static styles = css`
    :host {
      height: 100vh;
      /*display: flex;    */
      /*flex-direction: column;*/
      align-items: center;
      /*justify-content: flex-start;*/
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0;
      padding: 0;
      text-align: center;
      background-color: var(--prism-app-background-color);
    }

    main {
      display: grid;
      width: 100vw;
      height: 100vh;
    }
  `
}
