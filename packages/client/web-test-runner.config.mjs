// import { playwrightLauncher } from '@web/test-runner-playwright';
import resolve              from '@rollup/plugin-node-resolve'
import { esbuildPlugin }    from '@web/dev-server-esbuild'
import { importMapsPlugin } from '@web/dev-server-import-maps'
import copy                 from 'rollup-plugin-copy'

const filteredLogs = ['Running in dev mode', 'Lit is in dev mode'];

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'test/**/*.test.ts',

  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },

  plugins:[
    esbuildPlugin({ ts:true }),
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

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto',

  /** Amount of browsers to run concurrently */
  // concurrentBrowsers: 2,

  /** Amount of test files per browser to test concurrently */
  // concurrency: 1,

  /** Browsers to run tests on */
  // browsers: [
  //   playwrightLauncher({ product: 'chromium' }),
  //   playwrightLauncher({ product: 'firefox' }),
  //   playwrightLauncher({ product: 'webkit' }),
  // ],

  // See documentation for all available options
});
