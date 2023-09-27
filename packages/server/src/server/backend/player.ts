import { Status } from 'https://deno.land/std@0.178.0/http/http_status.ts'
import { RouterContext } from 'https://deno.land/x/oak@v12.1.0/router.ts'
import { PlayerID } from '../../../../common/src/index.ts'
import { GameStore } from '../game/index.ts'
import { toPlayerType } from '../game/util.ts'
import { PlayerParams } from '../initBackend.ts'

function toParams(ctx: RouterContext<any, any, any>) {
  return ctx.params as PlayerParams
}

function toPlayerId(params: PlayerParams): PlayerID {
  return {
    game: params.game,
    key: params.player,
    type: toPlayerType(params.role),
  }
}

export function createPlayer(store: GameStore) {
  return (ctx: RouterContext<any, any, any>) => {
    const params = toParams(ctx)
    const result = store.addPlayerToGame(toPlayerId(params))
    if (result.success) {
      ctx.response.status = Status.Created
      ctx.response.body = result
    } else {
      if (result.messages[0] === 'player already exists') {
        ctx.response.status = Status.OK
        ctx.response.body = result
      } else {
        ctx.response.status = Status.BadRequest
        ctx.response.body = result
      }
    }
  }
}

export function getPlayer(store: GameStore) {
  return (ctx: RouterContext<any, any, any>) => {
    const params = toParams(ctx)
    const player = store.findPlayerBy(toPlayerId(params))
    if (player) {
      ctx.response.status = Status.OK
      ctx.response.body = player.id
    } else {
      ctx.response.status = Status.NotFound
    }
  }
}
