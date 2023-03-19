import {delay}        from 'deno/std/async/delay.ts'
import {Application}  from 'oak'
import {superoak}     from 'superoak'

import '../../src/build/build.ts'
import {initBackend}  from '../../src/server/initBackend.ts'
import {initFrontend} from '../../src/server/initFrontend.ts'
import {create}       from '../../src/server/server.ts'

import {describe, it} from 'deno/std/testing/bdd.ts'

describe({
    name: 'health',
    fn: () => {

        describe(
            'frontend',
            () => {
                let app: Application

                it('init', () => {
                    app = create((app: Application) => {
                        initFrontend(app)
                    }).app
                })

                it('check root', async () => {
                    const request = await superoak(app)
                    await request.get('/')
                        .expect(200)
                        .expect('Content-Type', 'text/html; charset=UTF-8')
                })

                it('check assets', async () => {
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

        describe(
            'backend',
            () => {
                let app: Application

                it('init', () => {
                    app = create((app: Application) => {
                        initBackend(app)
                    }).app
                })

                it('check api', async () => {
                    const request = await superoak(app)
                    await request.get('/api')
                        .expect(200)
                        .expect('Content-Type', 'application/json; charset=UTF-8')
                        .expect({status: 'OK'})
                })

                it('check docs', async () => {
                    const request = await superoak(app)
                    await request.get('/api/docs')
                        .expect(200)
                        .expect('Content-Type', 'text/html')
                })
            },
        )
    },
    sanitizeOps: false
})
