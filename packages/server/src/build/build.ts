import {existsSync}   from 'https://deno.land/std@0.177.0/node/fs.ts'
import * as esbuild   from 'https://deno.land/x/esbuild@v0.17.11/mod.js'
import * as importMap from 'npm:esbuild-plugin-import-map'

const outdir = './dist'
console.log(`asset build starting: ${outdir}`)
if (!existsSync(outdir)) await Deno.mkdir(outdir, {recursive: true})
importMap.load('./import_map.json')

await esbuild.build({
    entryPoints: ['./src/client/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'neutral',
    plugins: [importMap.plugin()],
    outdir,
    chunkNames: 'chunks/[name]-[hash]',
})

await esbuild.stop()

await Deno.copyFile('./assets/index.html', './dist/index.html')
await Deno.copyFile('./assets/index.css', './dist/index.css')
await Deno.copyFile('./assets/favicon.ico', './dist/favicon.ico')

console.log('asset build done')
