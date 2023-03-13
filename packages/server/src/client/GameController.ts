import { ReactiveController, ReactiveControllerHost } from 'lit/'

export class GameController implements ReactiveController {
    host: ReactiveControllerHost
    id: string = ''

    constructor(host: ReactiveControllerHost) {
        this.host = host
        this.host.addController(this)
    }

    newGame() {
        this.id = makeId(5)
        this.host.gameId = this.id
        this.host.requestUpdate()
    }
}

function makeId(length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}
