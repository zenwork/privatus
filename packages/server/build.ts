import {existsSync}   from 'https://deno.land/std@0.177.0/node/fs.ts'
import * as esbuild   from 'https://deno.land/x/esbuild@v0.17.11/mod.js'
import * as importMap from 'npm:esbuild-plugin-import-map'

if (!existsSync('./dist')) await Deno.mkdir('./dist', {recursive: true})
importMap.load('./import_map.json')

console.log('esbuild')
await esbuild.build({
    entryPoints: ['./src/client/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'neutral',
    plugins: [importMap.plugin()],
    outdir: './dist',
    chunkNames: 'chunks/[name]-[hash]',
})

console.log('copy')
await Deno.copyFile('./templates/index.html', './dist/index.html')
await Deno.copyFile('./templates/index.css', './dist/index.css')
console.log('copy')
await Deno.copyFile('./templates/favicon.ico', './dist/favicon.ico')

console.log('done')
Deno.exit(0)
