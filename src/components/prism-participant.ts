import {consume}                 from '@lit-labs/context'
import {css, html, LitElement}   from 'lit'
import {customElement, property} from 'lit/decorators.js'
import {key, Registry}           from './prism'


export enum PType {
    CITIZEN = 'CITIZEN',
    SERVICE_PROVIDER = 'SERVICE PROVIDER',
    PROFESSIONAL = 'PROFESSIONAL',
    ISSUER = 'ISSUER',
    UNDEFINED = 'UNDEFINED'
}

@customElement('prism-participant')
export class PrismParticipant extends LitElement {

    static styles = [
        css`
            :host {

            }

            div {
                border: solid .1rem #000000;
                /*margin: .2rem;*/
                padding: .5rem;
            }
        `
    ]
    @property() pid = ''
    @property() ptype: PType = PType.UNDEFINED
    @consume({context: key, subscribe: true}) registry: Registry | undefined

    connectedCallback() {
        super.connectedCallback()
        const event = new CustomEvent('prism-register', {
            detail: {
                participant: {pid: this.pid, ptype: this.ptype}
            },
            bubbles: true,
            composed: true
        })

        this.dispatchEvent(event)
    }

    render(): unknown {
        return html`
            <div>
                <h3>type:${this.ptype}</h3>
                <h3>id:${this.pid}</h3>
            </div>
        `
    }
}
