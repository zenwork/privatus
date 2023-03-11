import logger                from 'https://deno.land/x/oak_logger/mod.ts'
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

app.use(logger.logger)
app.use(logger.responseTime)

// static content
app.use(async (context, next) => {

    let pathname = context.request.url.pathname
    if (pathname.indexOf('/api') > -1 || pathname.indexOf('/docs') > -1) {
        next()
    }
    let filepath = pathname === '/' ? '/index.html' : pathname
    let assetPath = `${Deno.cwd()}/dist${filepath}`
    console.log(assetPath)
    context.response.body = Deno.readFileSync(assetPath)
    let extension = assetPath.substring(assetPath.lastIndexOf('.') + 1)
    console.log(extension)
    switch (extension) {
        case 'html':
            context.response.type = 'text/html'
            break
        case 'css':
            context.response.type = 'text/css'
            break
        case 'js':
            context.response.type = 'application/javascript'
            break
        case 'json':
            context.response.type = 'application/json'
            break
        case 'ico':
            context.response.type = 'image/x-icon'
            break
        default:
            context.response.type = 'test/html'
    }

})

app.addEventListener(
    'listen',
    () => console.log('Listening on http://localhost:8080'),
)
await app.listen({port: 8080})
