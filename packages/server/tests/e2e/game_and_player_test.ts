import { assertEquals, assertExists } from 'deno/std/testing/asserts.ts'
import { describe, it } from 'deno/std/testing/bdd.ts'
import { Application } from 'oak'
import { superoak } from 'superoak'
import { PlayerRole, toPlayerRole } from '../../../common/src/index.ts'
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
          }).getApp()
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
          }).getApp()
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
          await request.delete(`/api/game/${gameId}`)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=UTF-8')
            .expect((response) => {
              equalOrError(response.body.messages[0], 'game ended')
            })
        })

        it('end game again', async () => {
          const request = await superoak(app)
          await request.delete(`/api/game/${gameId}`)
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
          }).getApp()
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

    describe(
      'create mock game',
      () => {
        let app: Application
        let gameId = ''

        it('init', () => {
          app = create((app: Application) => {
            initBackend(app)
          }).getApp()
        })

        it('create mock game', async () => {
          const request = await superoak(app)
          await request.get('/api/game/mock/for/CITIZEN')
            .expect((response) => {
              gameId = response.body.gameId
              assertExists(gameId, 'game id is not defined ')
            })
        })

        it('should contain 3 mocked players before test player joining', async () => {
          const request = await superoak(app)
          await request.get(`/api`)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=UTF-8')
            .expect((response) => {
              const players: [] = response.body.store[gameId].players
              assertEquals(players.length, 5)

              const mockPlayer: any[] = players.filter((p: any) => toPlayerRole(p.id.type) === PlayerRole.CITIZEN)
              assertEquals(mockPlayer.length, 0)
            })
        })
      },
    )
  },
  sanitizeOps: false,
})
