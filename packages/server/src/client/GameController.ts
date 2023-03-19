import { ReactiveController, ReactiveControllerHost } from 'lit/'

export class GameController implements ReactiveController {
    host: ReactiveControllerHost
    id = ''

    constructor(host: ReactiveControllerHost) {
        this.host = host
        this.host.addController(this)
    }

    newGame() {
        return fetch('/api/game', { method: 'POST' })
            .then((r) => r.json())
            .then((j) => {
                this.id = j.gameId
                this.host.gameId = this.id
                this.host.requestUpdate()
                return true
            }).catch((e) => {
                console.log(e)
                return false
            })
    }

    endGame() {
        return fetch(`/api/game/${this.id}`, { method: 'DELETE' })
            .then((r) => r.json())
            .then((j) => {
                if (j.messages[0] === 'game ended') {
                    this.id = null
                    this.host.gameId = this.id
                    this.host.requestUpdate()
                    return true
                } else {
                    return false
                }
            })
            .catch((e) => {
                console.log(e)
                return false
            })
    }
}
