import { Application } from 'oak'
import { superoak } from 'superoak'
import { initBackend } from '../../src/server/initBackend.ts'
import { create } from '../../src/server/server.ts'
import { equalOrError, matchOrError } from './bodyAssertions.ts'

Deno.test(
    'player not added because game does not exist ',
    async (t) => {
        let app: Application

        await t.step('init', () => {
            app = create((app: Application) => {
                initBackend(app)
            }).app
        })

        await t.step('create player', async () => {
            const request = await superoak(app)
            await request.put('/api/game/12345/ISSUER/p1')
                .expect(400)
                .expect('Content-Type', 'application/json; charset=UTF-8')
                .expect({ success: false, messages: ['game does not exist'] })
        })
    },
)

Deno.test(
    'create game',
    async (t) => {
        let app: Application
        let gameId = ''

        await t.step('init', () => {
            app = create((app: Application) => {
                initBackend(app)
            }).app
        })

        await t.step('create game', async () => {
            const request = await superoak(app)
            await request.post('/api/game')
                .expect(201)
                .expect('Content-Type', 'application/json; charset=UTF-8')
                .expect((response) => {
                    gameId = response.body.gameId
                    matchOrError(gameId, /[a-zA-Z0-9]{5}/)
                })
        })

        await t.step('end game', async () => {
            const request = await superoak(app)
            await request.post(`/api/game/${gameId}/end`)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=UTF-8')
                .expect((response) => {
                    equalOrError(response.body.messages[0], 'game ended')
                })
        })

        await t.step('end game again', async () => {
            const request = await superoak(app)
            await request.post(`/api/game/${gameId}/end`)
                .expect(202)
                .expect('Content-Type', 'application/json; charset=UTF-8')
                .expect((response) => {
                    equalOrError(response.body.messages[0], 'game not ended')
                })
        })
    },
)

Deno.test(
    'create and add player',
    async (t) => {
        let app: Application
        let gameId = ''

        await t.step('init', () => {
            app = create((app: Application) => {
                initBackend(app)
            }).app
        })

        await t.step('create game', async () => {
            const request = await superoak(app)
            await request.post('/api/game')
                .expect((response) => {
                    gameId = response.body.gameId
                })
        })
        //
        await t.step('create player', async () => {
            const request = await superoak(app)
            await request.put(`/api/game/${gameId}/ISSUER/p1`)
                .expect(201)
                .expect('Content-Type', 'application/json; charset=UTF-8')
                .expect({ success: true, messages: ['player created'] })
        })
    },
)
