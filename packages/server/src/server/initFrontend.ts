import {Application} from 'oak'

export function initFrontend(app: Application) {
// static content
    app.use(async (context, next) => {

        let pathname = context.request.url.pathname
        if (pathname.indexOf('/api') > -1 || pathname.indexOf('/docs') > -1) {
            next()
        }

        if (pathname !== '/debug.txt') {

            let filepath = pathname === '/' ? '/index.html' : pathname
            let assetPath = `${Deno.cwd()}/dist${filepath}`
            // console.log(assetPath)
            context.response.body = await Deno.readFile(assetPath)
            let extension = assetPath.substring(assetPath.lastIndexOf('.') + 1)
            // console.log(extension)
            switch (extension) {
                case 'html':
                    context.response.type = 'text/html'
                    break
                case 'css':
                    context.response.type = 'text/css'
                    break
                case 'js':
                    context.response.type = 'application/javascript'
                    break
                case 'json':
                    context.response.type = 'application/json'
                    break
                case 'ico':
                    context.response.type = 'image/x-icon'
                    break
                default:
                    context.response.type = 'text/plain'
            }
        }

    })
}
