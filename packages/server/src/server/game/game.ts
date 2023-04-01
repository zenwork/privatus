import { GameID, Message, MessageType, PlayerID, PlayerRole } from 'common'
import { RouterContext } from 'https://deno.land/x/oak@v12.1.0/router.ts'
import { ServerSentEvent } from 'https://deno.land/x/oak@v12.1.0/server_sent_event.ts'
import { Game, Player } from './index.ts'
import { LedgerPlayerFactory, ServerPlayerFactory } from './util.ts'

export class GameImplementation implements Game {
  key: GameID
  players: Player[]
  private server: Player
  private ledger: Player

  constructor(id: GameID) {
    this.server = ServerPlayerFactory()
    this.ledger = LedgerPlayerFactory()
    this.key = id
    this.players = [this.server, this.ledger]
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

  notify(msg: Message) {
    this.players.forEach((p) => {
      if (msg.destination === PlayerRole.ALL || msg.destination === p.id.type) {
        p.mailbox.push(msg)
      }
    })
    return true
  }

  close(): void {
    this.players.forEach(async (p) => {
      p.mailbox.push({
        type: MessageType.TEXT,
        body: 'ending game',
        origin: this.server.id,
        destination: PlayerRole.ALL,
      })
      this.clearMailbox(p)
      await p.channel?.close()
    })
  }

  private getPlayer(id: PlayerID) {
    return this.players.find(
      (p) => JSON.stringify(p.id) === JSON.stringify(id),
    )
  }

  private hearbeat(player: Player, id: PlayerID) {
    player.channel?.dispatchEvent(
      new ServerSentEvent('ping', { hearbeat: Date.now(), id }),
    )
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
