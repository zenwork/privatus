import {Application, Router} from 'https://deno.land/x/oak/mod.ts'
import {html, page}          from './html.ts'


const router = new Router()
router.get('/', (ctx) => {
    page(
        ctx.response,
        {title: 'privatus'},
        html` <p>My favorite kind of cake is: ${'Chocolate!!!'}${123}${1 + 2 === 3}</p> `
    )
})

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

app.addEventListener(
    'listen',
    () => console.log('Listening on http://localhost:8080'),
)
await app.listen({port: 8080})
