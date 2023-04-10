import { Application, Router, Status } from 'oak'
import { LifeCycle, Message, MessageType, notEnded } from './common/messages.ts'
import { GameStore, GameStoreImplementation } from './game/index.ts'

import { routes2Html } from './util/html.ts'

export function initBackend(app: Application): GameStore {
    const router = new Router()
    const store = new GameStoreImplementation()

    router.get('api', '/api', (ctx) => {
        ctx.response.body = { status: 'OK' }
    })

    router.post('create game', '/api/game', (ctx) => {
        const created = store.createGame()
        if (created) {
            ctx.response.status = Status.Created
            ctx.response.body = { gameId: created }
        }
    })

    router.delete('delete game', '/api/game/:id', (ctx) => {
        const result: Message = store.endGame(ctx.params.id)
        if (result.body === LifeCycle.ENDED) {
            ctx.response.status = Status.OK
            ctx.response.body = result
        } else {
            ctx.response.status = Status.Accepted
            ctx.response.body = notEnded
        }
    })

    router.put('register player', '/api/game/:game/:role/:player', (ctx) => {
        const result = store.addPlayerToGame(ctx.params.game, {
            id: ctx.params.player,
            type: ctx.params.role,
        })
        if (result.type !== MessageType.ERROR) {
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
            store
                .get(ctx.params.game)
                ?.openChannel({ id: ctx.params.player, type: ctx.params.role }, ctx)
        },
    )

    router.get('api docs', '/api/docs', (ctx) => {
        routes2Html(router, ctx.response)
    })

    router.post('send message', '/api/game/:game/message/all', async (ctx) => {
        const text = await ctx.request.body().value
        store.get(ctx.params.game)?.notifyAll(text)

        console.log(text)

        ctx.response.status = Status.Created
        ctx.response.body = { response: 'notified' }
    })

    app.use(router.routes())
    app.use(router.allowedMethods())
    return store
}
