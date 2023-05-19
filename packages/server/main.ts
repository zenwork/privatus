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
    let ls = ''
    for await (const entry of Deno.readDir(Deno.cwd())) {
      ls = `${ls} ${String(entry.name)}\n`
      if (entry.isDirectory) {
        let sub = ''
        for await (const subdirEntry of Deno.readDir(Deno.cwd() + '/' + entry.name)) {
          sub = `${sub}    ${String(subdirEntry.name)}\n`
        }
        ls = ls + sub + '\n'
      }
    }

    await fallbackServer({ cwd: Deno.cwd(), path: clientDir, ls, error: e.toString(), stacktrace: e.stack, cause: e.cause })
  }
}

if (Deno.args.length > 0 && Deno.args[0] === '--dev') {
  await start('../client/dist')
} else {
  await start('client/dist')
}
