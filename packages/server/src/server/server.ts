import { Application } from 'oak'
import logger from 'oak_logger'

export type Privatus = {
  app: Application
  start: (port: number) => Application
  startBlock: (port: number) => void
}

export function create(initFn: (app: Application<Record<string, any>>) => void): Privatus {
  const app: Application<Record<string, any>> = new Application()
  app.use(logger.logger)
  app.use(logger.responseTime)

  initFn(app)

  const runningPort = 8000

  return {
    app,
    start: (port = runningPort): Application => {
      app.addEventListener(
        'listen',
        () => console.log(`Listening on http://localhost:${port}}`),
      )

      app.listen({ port })
      return app
    },
    startBlock: async (port = runningPort) => {
      app.addEventListener(
        'listen',
        () => console.log(`Listening on http://localhost:${port}}`),
      )

      await app.listen({ port })
    },
  }
}
