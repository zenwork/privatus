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
        <div>
          <span> ${this.date.toISOString().substring(11, 19)} </span>
          <hr />
          <span class="message"><slot></slot></span>
        </div>
      </li>
    `
  }

  private theirs() {
    return html`
      <li class="theirs">
        <div>
          <span>${this.date.toISOString().substring(11, 19)}</span>
          <span>${String(this.name).padEnd(20)}</span>
          <hr />
          <span class="message"><slot></slot></span>
        </div>
      </li>
    `
  }

  static styles = [
    css`
      :host {
        width: 100%;
      }

      li {
        width: 100%;
      }

      div {
        font-size: 1rem;
        min-height: 3rem;
        justify-self: start;
        margin: 0.5rem;
        padding: 0.5rem 0.5rem 1rem;
        border-radius: 0.5rem;
        overflow: hidden;
      }

      @media (max-width: 349px) {
        div {
          width: calc(100% - 2rem);
        }
      }

      @media (min-width: 350px) {
        div {
          width: calc(55% - 2rem);
        }
      }

      li.mine {
        display: grid;
        grid-template-columns: auto;
      }

      li.mine > div {
        background: #fcfca7;

        justify-self: end;
        text-align: right;
      }

      li.theirs {
        display: grid;
        grid-template-columns: auto;
      }

      li.theirs > div {
        background: lightblue;
        justify-self: start;
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
        border: 0.1rem solid #ededed;
        border-radius: 0.1rem;
        opacity: 50%;
      }
    `,
  ]
}
