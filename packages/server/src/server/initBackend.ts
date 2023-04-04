import { Message, PlayerRole } from 'common'
import { Application, Router, Status } from 'oak'
import { GameStore, GameStoreImplementation } from './game/index.ts'
import { toPlayerType } from './game/util.ts'

import { routes2Html } from './util/html.ts'

type PlayerParams = { game: string; role: string; player: string }

export function initBackend(app: Application): GameStore {
  const router = new Router()
  const store = new GameStoreImplementation()

  router.get('api', '/api', (ctx) => {
    ctx.response.body = { status: 'OK' }
  })

  router.post('create game', '/api/game', (ctx) => {
    const created = store.create()
    if (created) {
      ctx.response.status = Status.Created
      ctx.response.body = { gameId: created }
    }
  })

  router.delete('delete game', '/api/game/:id', (ctx) => {
    const ended = store.end(ctx.params.id)
    if (ended) {
      ctx.response.status = Status.OK
      ctx.response.body = { messages: ['game ended'] }
    } else {
      ctx.response.status = Status.Accepted
      ctx.response.body = { messages: ['game not ended'] }
    }
  })

  router.put('register player', '/api/game/:game/:role/:player', (ctx) => {
    const params = ctx.params as PlayerParams
    const result = store.addPlayerToGame(params.game, {
      key: params.player,
      type: toPlayerType(params.role),
    })
    if (result.success) {
      ctx.response.status = Status.Created
      ctx.response.body = result
    } else {
      ctx.response.status = Status.BadRequest
      ctx.response.body = result
    }
  })

  router.get(
    'player channel',
    '/api/game/:game/channel/:role/:player',
    (ctx) => {
      const params = ctx.params as PlayerParams
      store
        .get(params.game)
        ?.openChannel(
          { key: params.player, type: toPlayerType(params.role) },
          ctx,
        )
    },
  )

  router.get('api docs', '/api/docs', (ctx) => {
    routes2Html(router, ctx.response)
  })

  router.post('send message', '/api/game/:game/message/all', async (ctx) => {
    const text: Message = (await ctx.request.body().value) as Message
    store.get(ctx.params.game)?.forward({ ...text, destination: PlayerRole.ALL })

    ctx.response.status = Status.Created
    ctx.response.body = { response: 'notified' }
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
  return store
}
