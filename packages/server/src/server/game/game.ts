import { RouterContext, ServerSentEvent, Status } from 'oak'
import { GameID, Message, MessageType, PlayerID, PlayerRole } from '../../../../common/src/index.ts'
import { Game, Player } from './index.ts'
import { LedgerPlayerFactory, ServerPlayerFactory } from './util.ts'

export const INFINITE = -1

export class GameImplementation implements Game {
  key: GameID
  players: Player[]
  private readonly server: Player
  private readonly ledger: Player

  constructor(id: GameID) {
    this.server = ServerPlayerFactory()
    this.ledger = LedgerPlayerFactory()
    this.key = id
    this.players = [this.server, this.ledger]
  }

  forward(msg: Message) {
    this.players.forEach((p) => {
      if (msg.destination === PlayerRole.ALL || msg.destination === p.id.type) {
        p.mailbox.push(msg)
      }
    })
    return true
  }

  openChannel(id: PlayerID, ctx: RouterContext<any, any, any>, max = INFINITE) {
    const player = this.findBy(id)

    if (player && !player.channel) {
      try {
        player.channel = ctx.sendEvents()
        let cycle = 0
        player.heartbeatId = setInterval(async () => {
          if (max === INFINITE || cycle < max) {
            this.hearbeat(player, id)
            this.clearMailbox(player)
            cycle++
          } else {
            await this.closeChannel(player)
          }
        }, 1000)
      } catch (e) {
        console.error(`Unable to open channel for ${id} - ${e.message}}`)
      }
    } else {
      ctx.response.status = Status.Forbidden
      ctx.response.body = 'player not created'
    }
  }

  closeAllChannels(): void {
    this.players.forEach(async (p) => {
      await this.closeChannel(p)
    })
  }

  private async closeChannel(p: Player) {
    p.mailbox.push({
      type: MessageType.TEXT,
      body: 'ending game',
      origin: this.server.id,
      destination: PlayerRole.ALL,
    })
    this.clearMailbox(p)
    clearInterval(p.heartbeatId)
    await p.channel?.close()
  }

  private clearMailbox(player: Player) {
    if (player.mailbox.length > 0) {
      while (player.mailbox.length > 0) {
        const message = player.mailbox.splice(0, 1)[0]
        player.channel?.dispatchEvent(new ServerSentEvent('msg', message))
      }
    }
  }

  private findBy(id: PlayerID) {
    return this.players.find(
      (p) => JSON.stringify(p.id) === JSON.stringify(id),
    )
  }

  private hearbeat(player: Player, id: PlayerID) {
    const message: Message = {
      type: MessageType.HEARTBEAT,
      body: Date.now().toString(),
      origin: this.server.id,
      destination: id.type,
    }
    player.channel
      ?.dispatchEvent(
        new ServerSentEvent('ping', message),
      )
  }
}
