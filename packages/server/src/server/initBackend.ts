import { Application, Router } from 'oak'
import { register } from './game/game.ts'
import { routes2Html } from './util/html.ts'

export function initBackend(app: Application) {
    const router = new Router()
    router.get(
        'api',
        '/api',
        (ctx) => {
            ctx.response.body = { status: 'OK' }
        },
    )

    router.get(
        'player status',
        '/api/status/:game/:player/:role',
        (ctx) => {
            const id = { game: ctx.params.game, player: ctx.params.player, role: ctx.params.role }
            register(id, ctx)
        },
    )

    router.get('api docs', '/api/docs', (ctx) => {
        routes2Html(router, ctx.response)
    })

    app.use(router.routes())
    app.use(router.allowedMethods())
}
