import logger        from 'https://deno.land/x/oak_logger/mod.ts'
import {Application} from 'oak'

export function create(initFn: (app: Application) => void): { start: () => void } {

    const app: Application<Record<string, any>> = new Application()
    app.use(logger.logger)
    app.use(logger.responseTime)

    initFn(app)

    return {
        start: async (port: number = 8000) => {
            app.addEventListener(
                'listen',
                () => console.log(`Listening on http://localhost:${port}}`),
            )
            await app.listen({port})
        }
    }
}
