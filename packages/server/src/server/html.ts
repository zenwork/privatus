import {Router, Route} from 'oak'

export function page(response, header: {}, body: string) {
    response.headers.set('content-type', 'text/html')
    response.body = `
<html lang="en">
    <head>
    <title>${header.title}</title>
    </head>
    <body>
        ${body}
    </body>
</html>`
}

export function html(strings: string[], ...args: any): string {
    let output: any[] = []
    strings.forEach((str, idx) => {
        output.push(str)
        if (args[idx]) output.push(String(args[idx]))
    })
    return output.join('')
}

export function routes2Html(router: Router, response: Response) {
    let docs: string[] = []
    for (const route: Route of router) {
        let methods = route.methods.filter(m => m !== 'HEAD').join(' ')
        let path = route.path
        let params = route.paramNames.length !== 0 ? '- [' + route.paramNames.join(',') + ']' : ''
        if (path !== '/api' && path !== '/docs') {
            console.log(route)
            docs.push(html`
                <ul>${route.name} - [${methods}] - ${path} ${params}</ul>`)
        }
    }
    return page(
        response,
        'privatus-api',
        html`
            <h1>api</h1>
            <ol>
                ${docs.join('\n')}
            </ol>`
    )
}
