import { assert, assertEquals } from 'deno/std/testing/asserts.ts'
import { Application } from 'oak'
import { superoak } from 'superoak'
import { GameStore, MessageType } from '../../src/server/game/game.ts'
import { initBackend } from '../../src/server/initBackend.ts'
import { create } from '../../src/server/server.ts'

Deno.test(
    'create and add player',
    async (t) => {
        let app: Application
        let gameId = ''
        let store: GameStore

        await t.step('init', () => {
            app = create((app: Application) => {
                store = initBackend(app)
            }).app
        })

        await t.step('create game and player', async () => {
            let request = await superoak(app)

            await request.post('/api/game')
                .expect((response) => {
                    gameId = response.body.gameId
                })

            request = await superoak(app)
            await request
                .put(`/api/game/${gameId}/ISSUER/p1`)
                .expect(201)
        })

        await t.step('send message', async () => {
            const request = await superoak(app)
            await request
                .post(`/api/game/${gameId}/message/all`)
                .send({ type: MessageType.TEXT, body: 'hello players' })
                .expect(201)

            const game = store.get(gameId)!
            const players = game.players
            assert(players.length > 0)
            players.forEach((p) => {
                assertEquals(p.mailbox.length, 1, 'messages not found')
            })
        })
    },
)
