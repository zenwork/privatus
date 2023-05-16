import { Application, Router, Status } from 'oak'
import { Message } from '../../../common/src/index.ts'
import { openChannelWith } from './backend/channel.ts'
import { createGame, deleteGame } from './backend/game.ts'
import { createPlayer, getPlayer } from './backend/player.ts'
import { GameStore, GameStoreImplementation } from './game/index.ts'

import { routes2Html } from './util/html.ts'

export type PlayerParams = { game: string; role: string; player: string }

export function initBackend(app: Application): GameStore {
  const router = new Router()
  const store = new GameStoreImplementation()

  router.get(
    'api',
    '/api',
    (ctx) => {
      ctx.response.body = { status: 'OK' }
    },
  )

  router
    .post(
      '/api/game',
      createGame(store),
    )
    .delete(
      '/api/game/:id',
      deleteGame(store),
    )

  router
    .put(
      '/api/game/:game/:role/:player',
      createPlayer(store),
    )
    .get(
      '/api/game/:game/:player',
      getPlayer(store),
    )
    .get(
      '/api/game/:game/channel/:role/:player',
      openChannelWith(store),
    )

  router.get('api docs', '/api/docs', (ctx) => {
    routes2Html(router, ctx.response)
  })

  router.post('send message', '/api/game/:game/message', async (ctx) => {
    const text: Message = (await ctx.request.body().value) as Message
    store.get(ctx.params.game)?.forward({ ...text })

    ctx.response.status = Status.Created
    ctx.response.body = { response: 'notified' }
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
  return store
}
