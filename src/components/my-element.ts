import {html, LitElement, ReactiveController, ReactiveControllerHost} from 'lit'
import {customElement, property}                                      from 'lit/decorators.js'

const tagName = 'my-element'

@customElement(tagName)
export class MyElement extends LitElement {
    @property()
    name = ''
    private generator = new Generator(this)

    render() {
        return html` <p>Hello ${this.name} ! magic number is: ${this.generator.randomNumber}</p> `
    }
}


class Generator implements ReactiveController {
    host: ReactiveControllerHost
    randomNumber = 0
    private intervalId?: number

    constructor(host: ReactiveControllerHost) {
        (this.host = host).addController(this)
    }

    hostConnected(): void {
        // @ts-ignore
        this.intervalId = setInterval(
            () => {
                this.randomNumber = Math.floor(Math.random() * 1000)
                console.log('magic:' + this.randomNumber)
                this.host.requestUpdate()
            }
            , 2000)
    }

    hostDisconnected(): void {
        console.log('stop the magic')
        clearInterval(this.intervalId)
    }

}
