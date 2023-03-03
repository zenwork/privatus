import {html, LitElement, ReactiveController, ReactiveControllerHost} from 'lit'
import {customElement, property}                                      from 'lit/decorators.js'

const tagName = 'my-element'

@customElement(tagName)
export class MyElement extends LitElement {
    @property()
    name = ''
    private ctlr = new RndController(this)

    render() {
        return html` <p>Hello ${this.name} ! magic number is: ${this.ctlr.rnd}</p> `
    }
}


class RndController implements ReactiveController {
    host: ReactiveControllerHost
    rnd = 0
    private intervalId?: number

    constructor(host: ReactiveControllerHost) {
        (this.host = host).addController(this)
    }

    hostConnected(): void {
        // @ts-ignore
        this.intervalId = setInterval(
            () => {
                this.rnd = Math.floor(Math.random() * 1000)
                console.log('magic:' + this.rnd)
                this.host.requestUpdate()
            }
            , 1000)
    }

    hostDisconnected(): void {
        console.log('stop the magic')
        clearInterval(this.intervalId)
    }

}
