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

        let {type, content} = getAsset(pathname)
        context.response.body = await content
        context.response.type = type

    })
}

function getAsset(pathname: string):{type:string,content:Promise<Uint8Array>} {
    const filepath = pathname === '/' ? '/index.html' : pathname
    const assetPath = `${Deno.cwd()}/dist${filepath}`

    const content =  Deno.readFile(assetPath)

    let type = getType(assetPath)
    return {type, content}
}

function getType(assetPath: string) {
    const extension = assetPath.substring(assetPath.lastIndexOf('.') + 1)

    let type = 'text/plain'
    switch (extension) {
        case 'html':
            return 'text/html'
            break
        case 'css':
            return 'text/css'
            break
        case 'js':
            return 'application/javascript'
            break
        case 'json':
            return 'application/json'
            break
        case 'ico':
            return 'image/x-icon'
            break
        default:
            return 'text/plain'
    }
}
