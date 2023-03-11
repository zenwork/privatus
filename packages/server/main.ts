import {Application, Router} from 'oak'
import {routes2Html}         from './src/server/html.ts'


const router = new Router()


router.get('api',
    '/api', (ctx) => {
        ctx.response.body = {status: 'OK'}
    })

router.get('api docs', '/docs', (ctx) => {
    routes2Html(router, ctx.response)
})


const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

// static content
app.use(async (context, next) => {
    const root = `${Deno.cwd()}/dist`

    console.log(context.request.url.pathname)
    try {
        let assetName: string = ''
        if (!context.request.url.pathname || context.request.url.pathname.endsWith('/')) {
            assetName = `/index.html`
        }
        let asset = root + assetName
        console.log(asset)
        await context.send({root: `${asset}`})
    } catch (e) {
        next()
    }
})

app.addEventListener(
    'listen',
    () => console.log('Listening on http://localhost:8080'),
)
await app.listen({port: 8080})
