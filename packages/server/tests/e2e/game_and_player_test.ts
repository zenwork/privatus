import { describe, it } from 'deno/std/testing/bdd.ts'
import { Application } from 'oak'
import { superoak } from 'superoak'
import { LifeCycle, Message, MessageType } from '../../src/server/common/messages.ts'
import { initBackend } from '../../src/server/initBackend.ts'
import { create } from '../../src/server/server.ts'
import { equalOrError, matchOrError } from './bodyAssertions.ts'

describe({
    name: 'game and player',
    fn: () => {
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
                        .expect((msg: Message) => msg.type === MessageType.ERROR)
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
                            const body: Record<string, any> = response.body.body
                            gameId = body.id
                            matchOrError(gameId, /GM-[a-zA-Z0-9]{5}/)
                        })
                })

                it('end game', async () => {
                    const request = await superoak(app)
                    await request.delete(`/api/game/${gameId}`)
                        .expect(200)
                        .expect('Content-Type', 'application/json; charset=UTF-8')
                        .expect((response) => {
                            equalOrError(response.body.body, 'game ended')
                        })
                })

                it('end game again', async () => {
                    const request = await superoak(app)
                    await request.delete(`/api/game/${gameId}`)
                        .expect(202)
                        .expect('Content-Type', 'application/json; charset=UTF-8')
                        .expect((response) => {
                            const message: Message = response.body
                            equalOrError(message.body, LifeCycle.UNCHANGED)
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
                            const body: Record<string, any> = response.body.body
                            gameId = body.id
                        })
                })
                //
                it('create player', async () => {
                    const request = await superoak(app)
                    await request.put(`/api/game/${gameId}/ISSUER/p1`)
                        .expect(201)
                        .expect('Content-Type', 'application/json; charset=UTF-8')
                        .expect((msg: Message) => msg.type === MessageType.INFO && msg.body === 'player created')
                })
            },
        )
    },
    sanitizeOps: false,
})
