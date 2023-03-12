import {Application} from 'oak'


/**
 * Serving static assets under supported deno deploy mechanisms
 * @param app
 */
export function initFrontend(app: Application) {
    // static content
    app.use(async (context, next) => {

        let pathname = context.request.url.pathname
        if (pathname.indexOf('/api') > -1 || pathname.indexOf('/docs') > -1) {
            next()
        }

        let {type, content} = await getAsset(pathname)
        context.response.body = content
        context.response.type = type

    })
}

async function getAsset(pathname: string) {
    const filepath = pathname === '/' ? '/index.html' : pathname
    const assetPath = `${Deno.cwd()}/dist${filepath}`

    const content = await Deno.readFile(assetPath)

    let type = getType(assetPath)
    return {type, content}
}

function getType(assetPath: string) {
    const extension = assetPath.substring(assetPath.lastIndexOf('.') + 1)

    let type = 'text/plain'
    switch (extension) {
        case 'html':
            type = 'text/html'
            break
        case 'css':
            type = 'text/css'
            break
        case 'js':
            type = 'application/javascript'
            break
        case 'json':
            type = 'application/json'
            break
        case 'ico':
            type = 'image/x-icon'
            break
        default:
            return 'text/plain'
    }
}
