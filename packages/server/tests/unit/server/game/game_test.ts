import {afterEach, beforeEach, describe, it,} from 'https://deno.land/x/test_suite@0.16.1/mod.ts'
import {GameStore, GameStoreImplementation}   from '../../../../src/server/game/game.ts'
import {expect} from "https://esm.sh/chai@4.3.7"


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

    it('should fail to find game with bad ID',()=>{
        expect(store.get('BAD!!')).to.be.undefined
    })

    it('should find game with ID',()=>{
        const id1 = store.createGame()
        expect(store.get(id1)).to.not.be.undefined
    })


})
