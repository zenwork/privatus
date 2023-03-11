import {serve} from 'https://deno.land/x/esbuild_serve/mod.ts'

serve({
    port: 8081,
    pages: {
        'index': './src/client/index.ts'
    }
})
