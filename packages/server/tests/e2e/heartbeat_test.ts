import { describe, it } from 'deno/std/testing/bdd.ts'
import { Application } from 'oak'
import { superoak } from 'superoak'
import {xKillAfterMaxHearbeats} from '../../src/server/backend/channel.ts'
import { GameStore } from '../../src/server/game/index.ts'
import { initBackend } from '../../src/server/initBackend.ts'
import { create } from '../../src/server/server.ts'

describe(
  'watch heartbeat',
  { sanitizeOps: false },
  () => {
    let app: Application
    let gameId = ''
    let store: GameStore

    it('init', () => {
      app = create((app: Application) => {
        store = initBackend(app)
      }).app
    })

    it('setup player', async () => {
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
    it('watch 3 heartbeats', async () => {
      let request = await superoak(app)

      // language=RegExp
      await request
        .get(`/api/game/${gameId}/channel/ISSUER/p1`)
        .set(xKillAfterMaxHearbeats,'3')
        .expect(new RegExp(
'(event: ping\ndata: \{"type":"heartbeat","body":"[0-9]{13}","origin":\{"key":"LEDGER","type":5},"destination":2}\n\n){3}'
+ 'event: msg\ndata: \{"type":"text","body":"ending game","origin":\{"key":"LEDGER","type":5},"destination":99}\n\n'))
    })


  },
)
