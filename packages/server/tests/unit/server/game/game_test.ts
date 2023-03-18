import {beforeEach, describe, it,}          from 'https://deno.land/x/test_suite@0.16.1/mod.ts'
import {GameStore, GameStoreImplementation} from '../../../../src/server/game/game.ts'
import {expect}                             from 'https://esm.sh/chai@4.3.7'


describe('use game', () => {
    let store: GameStore
    beforeEach(() => {
        store = new GameStoreImplementation()
    })

    it('should return a unique ID when game is created', () => {
        const id1 = store.createGame()
        const id2 = store.createGame()
        expect(id1).to.not.eql(id2)
        expect(id1).to.have.lengthOf(5)
        expect(id2).to.have.lengthOf(5)
    })

    it('should fail to find game with invalid ID', () => {
        expect(store.get('BAD!!')).to.be.undefined
    })

    it('should find game with ID', () => {
        const id1 = store.createGame()
        const game = store.get(id1)
        expect(game).to.not.be.undefined
        expect(game?.key).to.eql(id1)
    })

    it('should remove game', () => {
        const id = store.createGame()
        const result = store.endGame(id)
        expect(result).to.be.true
        const game = store.get(id)
        expect(game).to.be.undefined
    })

    it('should accept player creation', () => {
        const id = store.createGame()
        const result = store.addPlayerToGame(id, {id: 'foo', type: 'bar'})
        expect(result).to.be.eql({success: true, messages: ['player created']})

    })

    it('should fail to add player when game does not exist', () => {
        const result = store.addPlayerToGame('foobar', {id: 'foo', type: 'bar'})
        expect(result).to.be.eql({success: false, messages: ['game does not exist']})

    })

    it('should allow finding a player', () => {
        const id = store.createGame()
        const pid = {id: 'foo', type: 'bar'}
        store.addPlayerToGame(id, pid)
        const player = store.findPlayer(pid)
        expect(player?.id).to.be.eql(pid)

    })


})
