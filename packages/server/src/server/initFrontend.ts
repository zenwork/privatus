import { Application } from 'oak'

/**
 * Serving static assets under supported deno deploy mechanisms
 * @param app
 */
export function initFrontend(app: Application, clientPath: string) {
    // static content
    console.log(`serving frontend from ${clientPath}}`)
    app.use(async (context, next) => {
        const pathname = context.request.url.pathname
        if (pathname.indexOf('/api') > -1 || pathname.indexOf('/docs') > -1) {
            await next()
        }

        const { type, content } = getAsset(pathname, clientPath)
        context.response.body = await content
        context.response.type = type
    })
}

function getAsset(pathname: string, clientPath: string): { type: string; content: Promise<Uint8Array> } {
    const filepath = pathname === '/' ? '/index.html' : pathname
    const assetPath = `${clientPath}${filepath}`

    const content = Deno.readFile(assetPath)

    const type = getType(assetPath)
    return { type, content }
}

function getType(assetPath: string) {
    const extension = assetPath.substring(assetPath.lastIndexOf('.') + 1)

    switch (extension) {
        case 'html':
            return 'text/html'
        case 'css':
            return 'text/css'
        case 'js':
            return 'application/javascript'
        case 'json':
            return 'application/json'
        case 'ico':
            return 'image/x-icon'
        default:
            return 'text/plain'
    }
}
