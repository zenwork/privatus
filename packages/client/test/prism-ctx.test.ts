import { expect, fixture } from '@open-wc/testing'
import { PlayerRole } from 'common'
import { html } from 'lit'
import { PrismCtx } from '../src/components/prism-ctx'

import { PrismPlayer } from '../src/components/prism-player'

describe('Prism App', () => {
  let element: PrismCtx

  xit('has 4 participants by default', async () => {
    element = await fixture<PrismCtx>(html`<prism-ctx></prism-ctx>`)
    const badges = element.shadowRoot!.querySelectorAll('prism-player')!
    await expect(badges.length).to.eql(4)
  })

  xit('has 2 participant when 2 setup', async () => {
    element = await fixture(
      html`<prism-ctx
        players="${PlayerRole.CITIZEN},${PlayerRole.ISSUER}"
      ></prism-ctx>`
    )
    const players = element.shadowRoot!.querySelectorAll('prism-player')!
    await expect(players.length).to.eql(2)
    await expect((players[0] as PrismPlayer).playerType).to.eql(
      PlayerRole.CITIZEN
    )
    await expect((players[1] as PrismPlayer).playerType).to.eql(
      PlayerRole.ISSUER
    )
  })

  xit('passes the a11y audit', async () => {
    element = await fixture(html`<prism-ctx></prism-ctx>`)
    await expect(element).shadowDom.to.be.accessible()
  })
})
