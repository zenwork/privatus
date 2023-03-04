import {html, LitElement, ReactiveController} from 'lit'
import {customElement, property}              from 'lit/decorators.js'

const tagName = 'my-element'

@customElement(tagName)
export class MyElement extends LitElement {
    @property()
    name = ''

    @property({type: Number})
    refresh = 1000

    private generator = new Generator(this)

    previousNumbers: number[] = []

    render() {
        this.previousNumbers.push(this.generator.randomNumber)
        return html` <p>Hello ${this.name} ! magic numbers are: ${this.previousNumbers.join(', ')}</p> `
    }
}


class Generator implements ReactiveController {
    host: MyElement
    randomNumber = 0
    private intervalId?: number

    constructor(host: MyElement) {
        (this.host = host).addController(this)
    }

    hostUpdated(): void {
        if (!this.intervalId) {
            // @ts-ignore
            this.intervalId = setInterval(
                () => {
                    this.randomNumber = Math.floor(Math.random() * 1000)
                    this.host.requestUpdate()
                }
                , this.host.refresh)
        }
    }

    hostDisconnected(): void {
        console.log('stop the magic')
        clearInterval(this.intervalId)
    }

}
