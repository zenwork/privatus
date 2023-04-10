import { assertEquals, assertNotEquals } from 'deno/std/testing/asserts.ts'
import { beforeEach, describe, it } from 'https://deno.land/x/test_suite@0.16.1/mod.ts'
import { ended } from '../../../../src/server/common/messages.ts'
import { GameStore, GameStoreImplementation } from '../../../../src/server/game/index.ts'

describe('use game', () => {
    let store: GameStore
    beforeEach(() => {
        store = new GameStoreImplementation()
    })

    it('should return a unique ID when game is created', () => {
        const id1 = store.createGame()
        const id2 = store.createGame()
        assertNotEquals(id1, id2)
        assertEquals(id1.length, 5)
        assertEquals(id2.length, 5)
    })

    it('should fail to find game with invalid ID', () => {
        assertEquals(store.get('BAD!!'), undefined)
    })

    it('should find game with ID', () => {
        const id1 = store.createGame()
        const game = store.get(id1)
        assertNotEquals(game, undefined)
        assertEquals(game?.key, id1)
    })

    it('should remove game', () => {
        const id = store.createGame()
        const result = store.endGame(id)
        assertEquals(result, ended)
        const game = store.get(id)
        assertEquals(game, undefined)
    })

    it('should accept player creation', () => {
        const id = store.createGame()
        const result = store.addPlayerToGame(id, { id: 'foo', type: 'bar' })
        assertEquals(result.body, 'player created')
    })

    it('should fail to add player when game does not exist', () => {
        const result = store.addPlayerToGame('foobar', { id: 'foo', type: 'bar' })
        assertEquals(result.body, 'game does not exist')
    })

    it('should allow finding a player', () => {
        const id = store.createGame()
        const pid = { id: 'foo', type: 'bar' }
        store.addPlayerToGame(id, pid)
        const player = store.findPlayer(pid)
        assertEquals(player?.id, pid)
    })
})
