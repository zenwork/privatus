import { Response, Router } from 'oak'

export function page(response: Response, header: { title: string }, body: string) {
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
    const output: any[] = []
    strings.forEach((str, idx) => {
        output.push(str)
        if (args[idx]) output.push(String(args[idx]))
    })
    return output.join('')
}

export function routes2Html(router: Router, response: Response) {
    const docs: string[] = []
    for (const route of router) {
        const methods = route.methods.filter((m) => m !== 'HEAD').join(' ')
        const path = route.path
        const params = route.paramNames.length !== 0 ? `- [${route.paramNames.join(',')}]` : ''
        if (path !== '/api' && path !== '/docs') {
            docs.push(`
                <ul>${route.name} - [${methods}] - ${path} ${params}</ul>`)
        }
    }
    return page(
        response,
        { title: 'privatus-api' },
        `
            <h1>api</h1>
            <ol>
                ${docs.join('\n')}
            </ol>`,
    )
}
