import { RouterContext } from 'https://deno.land/x/oak@v12.1.0/router.ts'
import { GameStore } from '../game/index.ts'

export const healthcheck = (store: GameStore) => (ctx: RouterContext<any, any, any>) => {
  ctx.response.body = { status: 'OK', store: store.status() }
}
