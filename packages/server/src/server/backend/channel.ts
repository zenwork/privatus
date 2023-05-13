import { RouterContext, Status } from 'oak'
import { GameStore, INFINITE } from '../game/index.ts'
import { toPlayerType } from '../game/util.ts'
import { PlayerParams } from '../initBackend.ts'

export const xKillAfterMaxHearbeats = 'x-kill-after-max-hearbeats'

export function openChannelWith(store: GameStore) {
  return (ctx: RouterContext<any, any, any>) => {
    const params = ctx.params as PlayerParams
    const game = store.get(params.game)
    if (game) {
      game.openChannel(
        { key: params.player, type: toPlayerType(params.role) },
        ctx,
        ctx.request.headers.has(xKillAfterMaxHearbeats) ? Number(ctx.request.headers.get(xKillAfterMaxHearbeats)) : INFINITE,
      )
    } else {
      ctx.response.status = Status.Forbidden
      ctx.response.body = 'game not created'
    }
  }
}
