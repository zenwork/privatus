import {delay}        from 'deno/std/async/delay.ts'
import {Application}  from 'oak'
import {superoak}     from 'superoak'

import '../../src/build/build.ts'
import {initBackend}  from '../../src/server/initBackend.ts'
import {initFrontend} from '../../src/server/initFrontend.ts'
import {create}       from '../../src/server/server.ts'

Deno.test(
    'health test frontend',
    async (t) => {
        let app: Application

        await t.step('init', () => {
            app = create((app: Application) => {
                initFrontend(app)
            }).app
        })

        await t.step('check root', async () => {
            const request = await superoak(app)
            await request.get('/')
                .expect(200)
                .expect('Content-Type', 'text/html; charset=UTF-8')

        })

        await t.step('check assets', async () => {
            let request = await superoak(app)
            await request.get('/index.html')
                .expect(200)
                .expect('Content-Type', 'text/html; charset=UTF-8')


            request = await superoak(app)
            await request.get('/index.css')
                .expect(200)
                .expect('Content-Type', 'text/css; charset=UTF-8')


            request = await superoak(app)
            await request.get('/index.js')
                .expect(200)
                .expect('Content-Type', 'application/javascript; charset=UTF-8')


            await delay(1000)
        })
    },
)

Deno.test(
    'health test backend',
    async (t) => {
        let app: Application

        await t.step('init', () => {
            app = create((app: Application) => {
                initBackend(app)
            }).app
        })

        await t.step('check api', async () => {
            const request = await superoak(app)
            await request.get('/api')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=UTF-8')
                .expect({status: 'OK'})
        })

        await t.step('check docs', async () => {
            const request = await superoak(app)
            await request.get('/api/docs')
                .expect(200)
                .expect('Content-Type', 'text/html')
        })
    },
)
