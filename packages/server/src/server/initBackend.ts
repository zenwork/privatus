import { Application, Router } from 'oak'
import { openChannelWith } from './backend/channel.ts'
import { createGame, deleteGame, forwardMessage } from './backend/game.ts'
import { healthcheck } from './backend/monitoring.ts'
import { createPlayer, getPlayer } from './backend/player.ts'
import { GameStore, GameStoreImplementation } from './game/index.ts'

import { routes2Html } from './util/html.ts'

export type PlayerParams = { game: string; role: string; player: string }

export function initBackend(app: Application): GameStore {
  const router = new Router()
  const store = new GameStoreImplementation()

  router
    .get('/api', healthcheck(store))

  router
    .post('/api/game', createGame(store))
    .delete('/api/game/:id', deleteGame(store))

  router
    .put('/api/game/:game/:role/:player', createPlayer(store))
    .get('/api/game/:game/:player', getPlayer(store))
    .get('/api/game/:game/channel/:role/:player', openChannelWith(store))
    .post('/api/game/:game/message', forwardMessage(store))

  router.get('api docs', '/api/docs', (ctx) => {
    routes2Html(router, ctx.response)
  })

  app.use(router.routes())
  app.use(router.allowedMethods())
  return store
}
