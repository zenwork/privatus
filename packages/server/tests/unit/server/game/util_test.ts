import { assertEquals } from 'deno/std/testing/asserts.ts'
import { describe, it } from 'deno/std/testing/bdd.ts'
import { PlayerRole } from '#/common/players.ts'
import { toPlayerType } from '../../../../src/server/game/util.ts'

describe('use game', () => {
  describe('util', () => {
    describe('to player type', () => {
      it('should map to none by default', () => {
        assertEquals(toPlayerType('blabla'), PlayerRole.NONE)
        assertEquals(toPlayerType(''), PlayerRole.NONE)
        assertEquals(toPlayerType(null as unknown as string), PlayerRole.NONE)
        assertEquals(toPlayerType(undefined as unknown as string), PlayerRole.NONE)
      })
      it('ALL should map to ALL', () => {
        assertEquals(toPlayerType('ALL'), PlayerRole.ALL)
      })
      it('ISSUER should map to ISSUER', () => {
        assertEquals(toPlayerType('ISSUER'), PlayerRole.ISSUER)
      })
    })
  })
})
