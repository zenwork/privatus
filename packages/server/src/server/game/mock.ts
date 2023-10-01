import { Status } from 'https://deno.land/std@0.178.0/http/http_status.ts'
import { RouterContext } from 'https://deno.land/x/oak@v12.1.0/router.ts'
import { GameID, Message, MessageType, PlayerRole, toPlayerRole } from '../../../../common/src/index.ts'
import { GameImplementation, GameStore } from './index.ts'

export function mockFor(store: GameStore) {
  return (ctx: RouterContext<any, any, any>) => {
    const game: GameID = store.createMock()

    const forRole = ctx.params.role

    Object.entries(PlayerRole).forEach((kv, index) => {
      const type = toPlayerRole(kv[0])
      const key = `player-${index}`
      switch (type) {
        case PlayerRole.CITIZEN:
        case PlayerRole.ISSUER:
        case PlayerRole.PROVIDER:
        case PlayerRole.PROFESSIONAL:
          if (type !== forRole) {
            store.addPlayerToGame({ game, type, key })
          }
          break
        case PlayerRole.NONE:
        case PlayerRole.LEDGER:
        case PlayerRole.SERVER:
        case PlayerRole.ALL:
        default:
          break
      }
    })

    ctx.response.status = Status.OK
    ctx.response.body = { gameId: game }
  }
}

export class MockGame extends GameImplementation {
  forward(msg: Message): boolean {
    const result = super.forward(msg)

    try { // auto respond
      const dest = this.players.find((p) => p.id.type === msg.destination)
      if (dest) {
        super.forward({ type: MessageType.TEXT, origin: dest.id, destination: msg.origin.type, body: 'hi back!' })
      }

      if (msg.destination === PlayerRole.ALL) {
        this.players.forEach((p) => {
          const type = p.id.type
          switch (type) {
            case PlayerRole.CITIZEN:
            case PlayerRole.ISSUER:
            case PlayerRole.PROVIDER:
            case PlayerRole.PROFESSIONAL:
              if (type !== msg.origin.type) {
                super.forward({ type: MessageType.TEXT, origin: p.id, destination: msg.origin.type, body: 'hi back!' })
                this.clearMailbox(p)
              }
              break
            case PlayerRole.NONE:
            case PlayerRole.LEDGER:
            case PlayerRole.SERVER:
            case PlayerRole.ALL:
            default:
              break
          }
        })
      }
    } catch (e) {
      console.error('failed to auto respond', e)
    }

    return result
  }
}
