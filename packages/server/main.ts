import {initBackend}   from './src/server/initBackend.ts'
import {initFrontend}  from './src/server/initFrontend.ts'
import {create} from './src/server/server.ts'

await create((app) => {
        initBackend(app)
        initFrontend(app)
    })
    .start()
