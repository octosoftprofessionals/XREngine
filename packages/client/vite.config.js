import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import config from "config";
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig(() => {
  const env = loadEnv('', process.cwd() + '../../');
  process.env = {
    ...process.env,
    ...env,
    publicRuntimeConfig: JSON.stringify(config.get('publicRuntimeConfig'))
  };

  return {
    plugins: [
      commonjs({
        include: /node_modules/
      })
    ],
    server: {
      https: {
        key: fs.readFileSync('../../certs/key.pem'),
        cert: fs.readFileSync('../../certs/cert.pem')
      }
    },
    resolve: {
      alias: {
        'three-physx/lib/physx.release.esm.js': 'three-physx/lib/physx.release.esm.js',
        '@material-ui/icons': '@material-ui/icons/esm',
        "socket.io-client": "socket.io-client/dist/socket.io.js",
        "react-infinite-scroller": "react-infinite-scroller/dist/InfiniteScroll",
      }
    },
    define: {
      'process.env': process.env,
      'process.browser': process.browser,
    },
    build: {
      sourcemap: 'inline',
      rollupOptions: {
        output: {
          dir: 'dist',
          format: 'es',
          // we may need this at some point for dynamically loading static asset files from src, keep it here
          // entryFileNames: `assets/[name].js`,
          // chunkFileNames: `assets/[name].js`,
          // assetFileNames: `assets/[name].[ext]`
        },
      },
    },
  };
});
