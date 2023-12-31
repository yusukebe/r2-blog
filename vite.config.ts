import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import { getEnv } from '@hono/vite-dev-server/cloudflare-pages'
import pages from '@hono/vite-cloudflare-pages'
import { local2r2 } from './plugins/local2r2'

export default defineConfig(({ command }) => {
  if (command === 'build') {
    return {
      plugins: [
        pages({
          minify: true
        })
      ]
    }
  }
  return {
    ssr: {
      external: ['micromark']
    },
    plugins: [
      local2r2({
        r2Buckets: ['BUCKET'],
        bindingName: 'BUCKET',
        dir: './contents'
      }),
      devServer({
        entry: 'src/index.tsx',
        env: getEnv({
          r2Buckets: ['BUCKET'],
          r2Persist: true
        })
      })
    ]
  }
})
