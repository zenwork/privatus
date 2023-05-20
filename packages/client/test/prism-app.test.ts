import { html } from 'lit'
import { fixture, expect } from '@open-wc/testing'

import type { PrismApp } from '../src/prism-app'
import '../src/prism-app'

describe('Prism App', () => {
  let element: PrismApp
  beforeEach(async () => {
    element = await fixture(html` <prism-app></prism-app>`)
  })

  it('has 1 context', () => {
    const badges = element.shadowRoot!.querySelectorAll('prism-ctx')!
    expect(badges.length).to.eql(1)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})
