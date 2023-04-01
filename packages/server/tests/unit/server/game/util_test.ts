import { assertEquals } from 'deno/std/testing/asserts.ts'
import { describe, it } from 'deno/std/testing/bdd.ts'
import { PlayerType } from '../../../../src/server/game/index.ts'
import { toPlayerType } from '../../../../src/server/game/util.ts'

describe('use game', () => {
  describe('util', () => {
    describe('to player type', () => {
      it('should map to none by default', () => {
        assertEquals(toPlayerType('blabla'), PlayerType.NONE)
        assertEquals(toPlayerType(''), PlayerType.NONE)
        assertEquals(toPlayerType(null as unknown as string), PlayerType.NONE)
        assertEquals(toPlayerType(undefined as unknown as string), PlayerType.NONE)
      })
      it('ALL should map to ALL', () => {
        assertEquals(toPlayerType('ALL'), PlayerType.ALL)
      })
      it('ISSUER should map to ISSUER', () => {
        assertEquals(toPlayerType('ISSUER'), PlayerType.ISSUER)
      })
    })
  })
})
