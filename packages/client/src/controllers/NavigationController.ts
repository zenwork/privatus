import { LitElement } from 'lit'
import { ReactiveController } from 'lit/development'

export class NavigationController implements ReactiveController {
  constructor(host: LitElement) {
    host.addController(this)

    window.addEventListener(
      'hashchange',
      () => {
        console.log(
          'The hash has changed!',
          new URL(document.location.href).hash
        ) // eslint-disable-line no-console
      },
      false
    )
  }

  hostConnected(): void {}

  hostDisconnected(): void {}

  hostUpdated(): void {}

  hostUpdate(): void {}
}
