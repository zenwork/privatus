import {defineConfig} from 'astro/config'
import deno           from '@astrojs/deno'
import lit            from '@astrojs/lit'

export default defineConfig({
  output: 'server',
  adapter: deno(),
  // integrations: [lit()]
});
