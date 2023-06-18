import { LitElement } from 'lit'
import { ReactiveController } from 'lit/development'

export class NavigationController implements ReactiveController {
  constructor(host: LitElement) {
    host.addController(this)

    window.addEventListener('hashchange', () => {}, false)
  }

  hostConnected(): void {}

  hostDisconnected(): void {}

  hostUpdated(): void {}

  hostUpdate(): void {}
}
