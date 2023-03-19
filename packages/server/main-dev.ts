import {Application}  from 'oak'
import {initBackend}  from './src/server/initBackend.ts'
import {initDevMode}  from './src/server/initDevMode.ts'
import {initFrontend} from './src/server/initFrontend.ts'
import {create}       from './src/server/server.ts'

//todo(@zenwork) remove duplication
await create((app: Application<Record<string, any>>) => {
    initDevMode()
    initBackend(app)
    initFrontend(app)
}).startBlock()
