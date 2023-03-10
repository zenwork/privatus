export function page(response, header: {}, body: string[]) {
    response.headers.set('content-type', 'text/html')
    response.body = `
<html lang="en">
    <head>
    <title>${header.title}</title>
    </head>
    <body>
        ${body.join('')}
    </body>
</html>`
}

export function html(strings: string[], ...args: any): string[] {
    let output: any[] = []
    strings.forEach((str, idx) => {
        output.push(str)
        if (args[idx]) output.push(String(args[idx]))
    })
    return output
}
