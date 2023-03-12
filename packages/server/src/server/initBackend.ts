import {Application, Router} from 'oak'
import {routes2Html}         from './util/html.ts'

export function initBackend(app: Application) {
    const router = new Router()
    router.get('api',
        '/api', (ctx) => {
            ctx.response.body = {status: 'OK'}
        })

    router.get('api docs', '/docs', (ctx) => {
        routes2Html(router, ctx.response)
    })

    app.use(router.routes())
    app.use(router.allowedMethods())
}
