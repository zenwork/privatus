import { assertEquals } from 'deno/std/testing/asserts.ts'
import { describe, it } from 'deno/std/testing/bdd.ts'
import { PlayerRole, toPlayerRole } from '../../../../../common/src/players.ts'

describe('test util functions', () => {
  describe('player type conversion', () => {
    it('should map to none by default', () => {
      assertEquals(toPlayerRole('blabla'), PlayerRole.NONE)
      assertEquals(toPlayerRole(''), PlayerRole.NONE)
      assertEquals(toPlayerRole(null as unknown as string), PlayerRole.NONE)
      assertEquals(
        toPlayerRole(undefined as unknown as string),
        PlayerRole.NONE,
      )
    })
    it('should map \'ALL\' to ALL', () => {
      assertEquals(toPlayerRole('ALL'), PlayerRole.ALL)
    })
    it('should map \'ISSUER\' to ISSUER', () => {
      assertEquals(toPlayerRole('ISSUER'), PlayerRole.ISSUER)
    })
  })
})
