import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
import proxy from 'koa-proxies';
import copy  from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript'
import { fromRollup } from '@web/dev-server-rollup';
import { importMapsPlugin } from '@web/dev-server-import-maps'
import resolve              from '@rollup/plugin-node-resolve'


/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes('--hmr');

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open:'/',

  /** Resolve bare module imports */
  nodeResolve:{
    exportConditions:['browser', 'development']
  },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto'

  /** Set appIndex to enable SPA routing */
  appIndex:'./index.html',

  plugins:[
    fromRollup(typescript)(),
    resolve(),
    importMapsPlugin(),
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
    copy({
           targets:[{ src:'assets/**/*', dest:'./dist' }],
           // set flatten to false to preserve folder structure
           flatten:false
         })
  ],

  // See documentation for all available options
  middleware:[
    proxy('/api', {
      log:true,
      target:'http://0.0.0.0:8000'
    })
  ]
});
