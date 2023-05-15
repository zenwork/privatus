// import { Application } from 'oak'
import { fallbackServer } from './src/server/fallbackServer.ts'
// import { initBackend } from './src/server/initBackend.ts'
// import { initFrontend } from './src/server/initFrontend.ts'

try {
  console.log('STARTING')
  const clientDir = `${Deno.cwd()}/client-dist`
  const fileInfo = await Deno.stat(clientDir)
  await fallbackServer({ servingFrom: fileInfo.isDirectory })

  // import { create } from './src/server/server.ts'
  //   await create((app: Application<Record<string, any>>) => {
  //     initBackend(app)
  //     initFrontend(app, clientDir)
  //   }).startBlock()
} catch (e) {
  await fallbackServer({ error: e.toString() })
}
