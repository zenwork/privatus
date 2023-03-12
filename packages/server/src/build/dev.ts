import {existsSync}   from 'https://deno.land/std@0.177.0/node/fs.ts'
import * as esbuild   from 'https://deno.land/x/esbuild@v0.17.11/mod.js'
import * as importMap from 'npm:esbuild-plugin-import-map'

export async function esBuildWatch() {

    if (!existsSync('./dist')) await Deno.mkdir('./dist', {recursive: true})
    importMap.load('./import_map.json')

    const ctx = await esbuild.context({
        entryPoints: ['./src/client/dev.ts'],
        bundle: true,
        minify: true,
        sourcemap: true,
        platform: 'neutral',
        plugins: [importMap.plugin()],
        outfile: './dist/index.js',
        chunkNames: 'chunks/[name]-[hash]',
    })

    ctx.watch()

    await Deno.copyFile('./assets/index.html', './dist/index.html')
    await Deno.copyFile('./assets/index.css', './dist/index.css')
    await Deno.copyFile('./assets/favicon.ico', './dist/favicon.ico')

    // let { host, port } = await ctx.serve({
    //     servedir: 'www',
    // })

}
