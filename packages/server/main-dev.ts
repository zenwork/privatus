import { Application }  from 'oak'
import { initBackend }  from './src/server/initBackend.ts'
import { initFrontend } from './src/server/initFrontend.ts'
import { create }       from './src/server/server.ts'

//todo(@zenwork) remove duplication
await create((app: Application<Record<string, any>>) => {
  initBackend(app)
  initFrontend(app, `${Deno.cwd()}/../client/dist`)
}).startBlock()
