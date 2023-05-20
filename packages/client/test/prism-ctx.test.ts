import { expect, fixture } from '@open-wc/testing'
import { html } from 'lit'
import { PlayerRole } from 'common'
import { PrismCtx } from '../src/components/prism-ctx'

import { PrismParticipant } from '../src/components/prism-participant'

describe('Prism App', () => {
  let element: PrismCtx

  it('has 4 participants by default', async () => {
    element = await fixture(html`<prism-ctx></prism-ctx>`)
    const badges = element.shadowRoot!.querySelectorAll('prism-participant')!
    await expect(badges.length).to.eql(4)
  })

  it('has 2 participant when 2 setup', async () => {
    element = await fixture(
      html`<prism-ctx
        players="${PlayerRole.CITIZEN},${PlayerRole.ISSUER}"
      ></prism-ctx>`
    )
    const players = element.shadowRoot!.querySelectorAll('prism-participant')!
    await expect(players.length).to.eql(2)
    await expect((players[0] as PrismParticipant).playerType).to.eql(
      PlayerRole.CITIZEN
    )
    await expect((players[1] as PrismParticipant).playerType).to.eql(
      PlayerRole.ISSUER
    )
  })

  it('passes the a11y audit', async () => {
    element = await fixture(html`<prism-ctx></prism-ctx>`)
    await expect(element).shadowDom.to.be.accessible()
  })
})
