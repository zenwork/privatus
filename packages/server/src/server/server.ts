import { Application, isHttpError } from 'oak'
import logger from 'oak_logger'

const defaultPort: number = 8000

export type Privatus = {
  getApp: () => Application
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

  function start(port: number) {
    initFn(app)
    app.addEventListener(
      'listen',
      () => console.log(`Listening on http://localhost:${port}}`),
    )
  }

  return {
    getApp: (): Application => {
      initFn(app)
      return app
    },
    start: (port = defaultPort): Application => {
      start(port)
      app.listen({ port })
      return app
    },
    startBlock: async (port = defaultPort) => {
      start(port)
      await app.listen({ port })
    },
  }
}
