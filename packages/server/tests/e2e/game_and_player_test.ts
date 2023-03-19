import { Application } from 'oak'
import { superoak } from 'superoak'
import { initBackend } from '../../src/server/initBackend.ts'
import { create } from '../../src/server/server.ts'
import { equalOrError, matchOrError } from './bodyAssertions.ts'
import { describe, it } from 'deno/std/testing/bdd.ts'

describe(
    'player not added because game does not exist ',
    () => {
        let app: Application

        it('init', () => {
            app = create((app: Application) => {
                initBackend(app)
            }).app
        })

        it('create player', async () => {
            const request = await superoak(app)
            await request.put('/api/game/12345/ISSUER/p1')
                .expect(400)
                .expect('Content-Type', 'application/json; charset=UTF-8')
                .expect({ success: false, messages: ['game does not exist'] })
        })
    },
)

describe(
    'create game',
    () => {
        let app: Application
        let gameId = ''

        it('init', () => {
            app = create((app: Application) => {
                initBackend(app)
            }).app
        })

        it('create game', async () => {
            const request = await superoak(app)
            await request.post('/api/game')
                .expect(201)
                .expect('Content-Type', 'application/json; charset=UTF-8')
                .expect((response) => {
                    gameId = response.body.gameId
                    matchOrError(gameId, /[a-zA-Z0-9]{5}/)
                })
        })

        it('end game', async () => {
            const request = await superoak(app)
            await request.post(`/api/game/${gameId}/end`)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=UTF-8')
                .expect((response) => {
                    equalOrError(response.body.messages[0], 'game ended')
                })
        })

        it('end game again', async () => {
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

describe(
    'create and add player',
    () => {
        let app: Application
        let gameId = ''

        it('init', () => {
            app = create((app: Application) => {
                initBackend(app)
            }).app
        })

        it('create game', async () => {
            const request = await superoak(app)
            await request.post('/api/game')
                .expect((response) => {
                    gameId = response.body.gameId
                })
        })
        //
        it('create player', async () => {
            const request = await superoak(app)
            await request.put(`/api/game/${gameId}/ISSUER/p1`)
                .expect(201)
                .expect('Content-Type', 'application/json; charset=UTF-8')
                .expect({ success: true, messages: ['player created'] })
        })
    },
)
