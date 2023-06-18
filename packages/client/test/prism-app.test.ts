import { html } from 'lit'
import { fixture, expect, aTimeout } from '@open-wc/testing'

import type { PrismApp } from '../src/prism-app'
import '../src/prism-app'

describe('Prism App', () => {
  let element: PrismApp
  beforeEach(async () => {
    element = await fixture(html` <prism-app></prism-app>`)
  })

  it('has 1 view', async () => {
    await aTimeout(10)
    const elements = element.shadowRoot!.querySelectorAll('prism-view-home')!
    expect(elements.length).to.eql(1)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})
