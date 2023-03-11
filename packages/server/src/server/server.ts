import logger        from 'https://deno.land/x/oak_logger/mod.ts'
import {Application} from 'oak'

export function create(fn: (app: Application) => void): { start: () => void } {

    const app = new Application()
    app.use(logger.logger)
    app.use(logger.responseTime)
    fn(app)

    return {
        start: async () => {
            app.addEventListener(
                'listen',
                () => console.log('Listening on http://localhost:8080'),
            )
            await app.listen({port: 8080})
        }
    }
}
