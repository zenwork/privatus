import { RouterContext } from 'https://deno.land/x/oak@v12.1.0/router.ts'
import { ServerSentEvent } from 'https://deno.land/x/oak@v12.1.0/server_sent_event.ts'
import { Game, GameID, Message, MessageType, Player, PlayerID } from './index.ts'

export class GameImplementation implements Game {
    key: GameID
    players: Player[]

    constructor(id: GameID) {
        this.key = id
        this.players = []
    }

    openChannel(id: PlayerID, ctx: RouterContext<any, any, any>) {
        const player = this.getPlayer(id)

        if (player && !player.channel) {
            try {
                player.channel = ctx.sendEvents()
                setInterval(() => {
                    this.hearbeat(player, id)
                    this.clearMailbox(player)
                }, 1000)
            } catch (e) {
                console.error(`Unable to open channel for ${id} - ${e.message}}`)
            }
        }
    }

    notifyAll(msg: Message) {
        this.players.forEach((p) => {
            // console.log('push')
            p.mailbox.push(msg)
        })
        return true
    }

    close(): void {
        this.players.forEach(async (p) => {
            p.mailbox.push({ type: MessageType.TEXT, body: 'ending game', origin: 'server' })
            this.clearMailbox(p)
            await p.channel?.close()
        })
    }

    private getPlayer(id: PlayerID) {
        return this.players.find((p) => JSON.stringify(p.id) === JSON.stringify(id))
    }

    private hearbeat(player: Player, id: PlayerID) {
        player.channel?.dispatchEvent(new ServerSentEvent('ping', { hearbeat: Date.now(), id }))
    }

    private clearMailbox(player: Player) {
        if (player.mailbox.length > 0) {
            while (player.mailbox.length > 0) {
                const message = player.mailbox.splice(0, 1)[0]
                player.channel?.dispatchEvent(new ServerSentEvent('msg', message))
            }
        }
    }
}
