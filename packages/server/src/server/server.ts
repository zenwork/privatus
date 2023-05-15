import { Application, isHttpError } from 'oak'
import logger from 'oak_logger'

export type Privatus = {
  app: Application
  start: (port: number) => Application
  startBlock: (port?: number) => void
}

export function create(initFn: (app: Application<Record<string, any>>) => void): Privatus {
  const app: Application<Record<string, any>> = new Application()
  app.use(logger.logger)
  app.use(logger.responseTime)

  app.use(async (context, next) => {
    try {
      await next()
    } catch (err) {
      if (isHttpError(err)) {
        context.response.status = err.status
      } else {
        context.response.status = 500
      }
      context.response.body = { error: err.message }
      context.response.type = 'json'
    }
  })

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
