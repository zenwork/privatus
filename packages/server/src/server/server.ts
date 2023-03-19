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

    let runningPort = 8000

    return {
        app,
        start: (port = 8000): Application => {
            app.addEventListener(
                'listen',
                () => console.log(`Listening on http://localhost:${port}}`),
            )
            runningPort = port
            app.listen({port: runningPort})
            return app
        },
        startBlock: async (port = 8000) => {
            app.addEventListener(
                'listen',
                () => console.log(`Listening on http://localhost:${port}}`),
            )
            runningPort = port
            await app.listen({port: runningPort})
        },
    }
}
