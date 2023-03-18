import {Application, Router, Status}       from 'oak'
import {GameStoreImplementation, register} from './game/game.ts'
import {routes2Html}                       from './util/html.ts'

export function initBackend(app: Application) {
    const router = new Router()
    const store = new GameStoreImplementation()
    router.get(
        'api',
        '/api',
        (ctx) => {
            ctx.response.body = {status: 'OK'}
        },
    )

    router.post(
        'register',
        '/api/game',
        (ctx) => {
            const created = store.createGame()
            if (created) {
                ctx.response.status = Status.Created
                ctx.response.body = {gameId: created}
            }

        },
    )

    router.post(
        'register',
        '/api/game/:id/end',
        (ctx) => {
            const ended = store.endGame(ctx.params.id)
            if (ended) {
                ctx.response.status = Status.OK
                ctx.response.body = {messages: ['game ended']}
            } else {
                ctx.response.status = Status.Accepted
                ctx.response.body = {messages: ['game not ended']}
            }
        },
    )

    router.put(
        'register',
        '/api/game/:game/:role/:player',
        (ctx) => {
            const result = store.addPlayerToGame(ctx.params.game, {id: ctx.params.player, type: ctx.params.role})
            if (result.success) {
                ctx.response.status = Status.Created
                ctx.response.body = result
            } else {
                ctx.response.status = Status.BadRequest
                ctx.response.body = result
            }

        },
    )

    router.get(
        'player status',
        '/api/status/:game/:player/:role',
        (ctx) => {
            const id = {game: ctx.params.game, player: ctx.params.player, role: ctx.params.role}
            register(id, ctx)
        },
    )

    router.get('api docs', '/api/docs', (ctx) => {
        routes2Html(router, ctx.response)
    })

    app.use(router.routes())
    app.use(router.allowedMethods())
}
