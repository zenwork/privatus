import {Application}  from 'https://deno.land/x/oak@v12.1.0/application.ts'
import {superoak}     from 'superoak'

import '../../src/build/build.ts'
import {initBackend}  from '../../src/server/initBackend.ts'
import {initFrontend} from '../../src/server/initFrontend.ts'
import {create}       from '../../src/server/server.ts'

Deno.test(
    'health test frontend',
    async (t) => {
        let app: Application

        await t.step('init', async () => {
            app = create((app: Application<Record<string, any>>) => {
                initFrontend(app)
            }).app
        })

        await t.step('check root', async () => {
                let request = await superoak(app)
                await request.get('/')
                    .expect(200)
                    .expect('Content-Type', 'text/html; charset=UTF-8')
            }
        )

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
            }
        )


    }
)

Deno.test(
    'health test backend',
    async (t) => {
        let app: Application

        await t.step('init', async () => {
            app = create((app: Application<Record<string, any>>) => {
                initBackend(app)
            }).app
        })

        await t.step('check api', async () => {
                let request = await superoak(app)
                await request.get('/api')
                    .expect(200)
                    .expect('Content-Type', 'application/json; charset=UTF-8')
                    .expect({status: 'OK'})
            }
        )

        await t.step('check docs', async () => {
                let request = await superoak(app)
                await request.get('/api/docs')
                    .expect(200)
                    .expect('Content-Type', 'text/html')
            }
        )


    }
)
