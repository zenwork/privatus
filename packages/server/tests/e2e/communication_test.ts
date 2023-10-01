import { assert, assertEquals } from 'deno/std/testing/asserts.ts'
import { beforeEach, describe, it } from 'deno/std/testing/bdd.ts'
import { Application } from 'oak'
import { superoak } from 'superoak'
import { MessageType, PlayerID, PlayerRole } from '../../../common/src/index.ts'
import { GameStore } from '../../src/server/game/index.ts'
import { initBackend } from '../../src/server/initBackend.ts'
import { create } from '../../src/server/server.ts'

describe('create and add player', { sanitizeOps: false }, () => {
  let app: Application
  let gameId = ''
  let store: GameStore

  beforeEach(async () => {
    app = create((app: Application) => {
      store = initBackend(app)
    }).getApp()

    let request = await superoak(app)

    // create game
    await request.post('/api/game').expect((response) => {
      gameId = response.body.gameId
    })

    //create player 1
    request = await superoak(app)
    await request.put(`/api/game/${gameId}/PROVIDER/p1`).expect(201)

    //create player 2
    request = await superoak(app)
    await request.put(`/api/game/${gameId}/CITIZEN/p2`).expect(201)
  })

  it('send message to one', async () => {
    const request = await superoak(app)

    const game = store.get(gameId)!
    const players = game.players
    assert(players.length > 0)

    await request
      .post(`/api/game/${gameId}/message`)
      .send({
        type: MessageType.TEXT,
        body: 'hello players',
        origin: {
          game: gameId,
          key: 'p2',
          type: PlayerRole.CITIZEN,
        } as PlayerID,
        destination: PlayerRole.PROVIDER,
      })
      .expect(201)

    players.forEach((p) => {
      if (p.id.key === 'p1') {
        assertEquals(p.mailbox.length, 1, 'message not found')
      } else {
        assertEquals(p.mailbox.length, 0, 'message found')
      }
    })
  })

  it('send message to all', async () => {
    const request = await superoak(app)

    const game = store.get(gameId)!
    const players = game.players
    assert(players.length > 0)

    await request
      .post(`/api/game/${gameId}/message`)
      .send({
        type: MessageType.TEXT,
        body: 'hello players',
        origin: {
          game: gameId,
          key: 'p2',
          type: PlayerRole.CITIZEN,
        } as PlayerID,
        destination: PlayerRole.ALL,
      })
      .expect(201)

    players.forEach((p) => {
      if (p.id.key === 'p2') {
        assertEquals(p.mailbox.length, 0, `no message should be found`)
      } else {
        assertEquals(p.mailbox.length, 1, 'message not found')
      }
    })
  })
})
