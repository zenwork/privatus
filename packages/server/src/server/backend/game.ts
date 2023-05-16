import { Status } from 'https://deno.land/std@0.178.0/http/http_status.ts'
import { RouterContext } from 'https://deno.land/x/oak@v12.1.0/router.ts'
import { GameStore } from '../game/index.ts'

export function createGame(store: GameStore) {
  return (ctx: RouterContext<any, any, any>) => {
    const created = store.create()
    if (created) {
      ctx.response.status = Status.Created
      ctx.response.body = { gameId: created }
    }
  }
}

export function deleteGame(store: GameStore) {
  return (ctx: RouterContext<any, any, any>) => {
    const ended = store.end(ctx.params.id)
    if (ended) {
      ctx.response.status = Status.OK
      ctx.response.body = { messages: ['game ended'] }
    } else {
      ctx.response.status = Status.Accepted
      ctx.response.body = { messages: ['game not ended'] }
    }
  }
}
