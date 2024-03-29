import { html } from 'lit'
import { fixture, expect } from '@open-wc/testing'

import type { PrismHeartbeat } from '../src/components/prism-heartbeat'
import '../src/components/prism-heartbeat'

describe('Prism Heartbeat', () => {
  let element: PrismHeartbeat
  beforeEach(async () => {
    element = await fixture(html` <prism-heartbeat
      status="1"
    ></prism-heartbeat>`)
  })

  it('check the presence of the badges', () => {
    const badges = element.shadowRoot!.querySelectorAll('sl-badge')!
    expect(badges.length).to.eql(1)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})
