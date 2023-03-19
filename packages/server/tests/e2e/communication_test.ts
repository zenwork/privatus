// import { assert, assertEquals } from 'deno/std/testing/asserts.ts'
// import { Application } from 'oak'
// import { superoak } from 'superoak'
// import { GameStore } from '../../src/server/game/game.ts'
// import { initBackend } from '../../src/server/initBackend.ts'
import { create } from '../../src/server/server.ts'
import { describe, it } from 'deno/std/testing/bdd.ts'

describe(
    'create and add player',
    () => {
        // let app: Application
        // let gameId = ''
        // let store: GameStore

        it('init', () => {
            create(() => {
                // initBackend(app)
            }).app
        })
        //
        // it('create game and player', async () => {
        //     let request = await superoak(app)
        //
        //     await request.post('/api/game')
        //         .expect((response) => {
        //             gameId = response.body.gameId
        //         })
        //
        //     request = await superoak(app)
        //     await request
        //         .put(`/api/game/${gameId}/ISSUER/p1`)
        //         .expect(201)
        // })
        //
        // it('send message', async () => {
        //     const request = await superoak(app)
        //     await request
        //         .post(`/api/game/${gameId}/message/all`)
        //         .send({ type: MessageType.TEXT, body: 'hello players' })
        //         .expect(201)
        //
        //     const game = store.get(gameId)!
        //     const players = game.players
        //     assert(players.length > 0)
        //     players.forEach((p) => {
        //         assertEquals(p.mailbox.length, 1, 'messages not found')
        //     })
        // })
    },
)
