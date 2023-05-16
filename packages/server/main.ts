import { Application } from 'oak'
import { continueIfDir, fallbackServer } from './src/server/fallbackServer.ts'
import { initBackend } from './src/server/initBackend.ts'
import { initFrontend } from './src/server/initFrontend.ts'
import { create } from './src/server/server.ts'

export async function start(clientDir: string) {
  try {
    console.log('STARTING')

    await continueIfDir(clientDir)

    await create((app: Application<Record<string, any>>) => {
      initBackend(app)
      initFrontend(app, clientDir)
    }).startBlock()
  } catch (e) {
    await fallbackServer({ path: clientDir, error: e.toString(), stacktrace: e.stack, cause: e.cause })
  }
}

if (Deno.args.length > 0 && Deno.args[0] === '--dev') {
  await start(import.meta.resolve('../client/dist').replace('file://', ''))
} else {
  await start(import.meta.resolve('../../client/dist').replace('file://', ''))
}
