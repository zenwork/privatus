import { Application } from 'oak'
import { fallbackServer } from './src/server/fallbackServer.ts'
import { initBackend } from './src/server/initBackend.ts'
import { initFrontend } from './src/server/initFrontend.ts'
import { create } from './src/server/server.ts'

try {
  console.log('STARTING')
  const clientDir = `${Deno.cwd()}/server/client-dist`

  await create((app: Application<Record<string, any>>) => {
    initBackend(app)
    initFrontend(app, clientDir)
  }).startBlock()
} catch (e) {
  await fallbackServer({ error: e.toString() })
}
