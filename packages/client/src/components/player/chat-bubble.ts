import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('prism-player-chat-bubble')
export class ChatBubble extends LitElement {
  @property({ type: Boolean, reflect: true })
  declare me: boolean

  @property()
  declare date: Date

  @property()
  declare name: string

  constructor() {
    super()
    this.me = false
  }

  protected render(): unknown {
    return this.me ? this.mine() : this.theirs()
  }

  private mine() {
    return html`
      <li class="mine">
        <span> ${this.date.toISOString().substring(11, 19)} </span>
        <hr />
        <span class="message"><slot></slot></span>
      </li>
      <li>&nbsp;</li>
    `
  }

  private theirs() {
    return html`
      <li class="theirs">
        <span>${this.date.toISOString().substring(11, 19)}</span>
        <span>${String(this.name).padEnd(20)}</span>
        <hr />
        <span class="message"><slot></slot></span>
      </li>
    `
  }

  static styles = [
    css`
      :host {
      }

      li {
        font-size: 1rem;
        width: 40%;
        margin: 0.5rem;
        padding: 0.5rem 0.5rem 1rem;
        min-height: 3rem;
        border-radius: 0.5rem;
      }

      li.mine {
        background: lightgoldenrodyellow;
        text-align: right;
        float: right;
      }

      li.theirs {
        background: lightblue;
        text-align: left;
      }

      span {
        padding: 0.5rem;
      }

      span.message {
        padding: 1rem;
        max-width: 30%;
      }

      hr {
        border: 0.1rem solid white;
        border-radius: 0.1rem;
        opacity: 50%;
      }
    `,
  ]
}
