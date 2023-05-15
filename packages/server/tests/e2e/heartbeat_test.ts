import { describe, it } from 'deno/std/testing/bdd.ts'
import { Application } from 'oak'
import { superoak } from 'superoak'
import { xKillAfterMaxHearbeats } from '../../src/server/backend/channel.ts'
import { initBackend } from '../../src/server/initBackend.ts'
import { create } from '../../src/server/server.ts'

describe(
  'watch heartbeat',
  { sanitizeOps: false },
  () => {
    let app: Application
    let gameId = ''

    it('init', () => {
      app = create((app: Application) => {
        initBackend(app)
      }).getApp()
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
      const request = await superoak(app)

      // language=RegExp
      await request
        .get(`/api/game/${gameId}/channel/ISSUER/p1`)
        .set(xKillAfterMaxHearbeats, '3')
        .expect(
          new RegExp(
            '(event: ping\ndata:' +
              ' \{"type":"heartbeat","body":"[0-9]{13}","origin":\{"key":"server","type":"SERVER"},"destination":"ISSUER"}\n\n){3}' +
              'event: msg\ndata: \{"type":"text","body":"ending game","origin":\{"key":"server","type":"SERVER"},"destination":"ALL"}\n\n',
          ),
        )
    })
  },
)
