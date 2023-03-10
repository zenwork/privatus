// import deno           from '@astrojs/deno'
import lit            from '@astrojs/lit'
import {defineConfig} from 'astro/config'

export default defineConfig(
    {
        output:'server',
        // adapter:deno(),
        integrations:[lit()]
    }
)
