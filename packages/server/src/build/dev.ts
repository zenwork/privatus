import {existsSync}   from 'deno/std/node/fs.ts'
import * as esbuild   from 'esbuild'
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

}
