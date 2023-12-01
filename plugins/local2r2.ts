import { Plugin, ViteDevServer } from 'vite'
import { Miniflare } from 'miniflare'
import fs from 'fs/promises'
import { resolve, relative } from 'path'

type Options = {
  dir: string
  r2Buckets: string[] | Record<string, string>
  r2Persist?: boolean
}

const nullScript = 'export default { fetch: () => new Response(null, { status: 404 }) };'

export function local2r2(options: Options): Plugin {
  let server: ViteDevServer

  const targetDir = resolve(options.dir)

  const plugin: Plugin = {
    name: 'local2r2',
    configureServer(s) {
      server = s
    },
    async watchChange(id) {
      const mf = new Miniflare({
        modules: true,
        script: nullScript,
        r2Buckets: options.r2Buckets,
        r2Persist: options.r2Persist ?? true
      })

      if (id.startsWith(targetDir)) {
        const fileName = relative(targetDir, id)
        const bucket = await mf.getR2Bucket('BUCKET')
        try {
          await fs.access(id)
          console.info(`${fileName} is updated`)
          const content = await fs.readFile(id, 'utf8')
          await bucket.put(fileName, content)
        } catch (e: any) {
          if (e.code === 'ENOENT') {
            console.info(`${fileName} is deleted`)
            await bucket.delete(fileName)
          } else {
            console.error(`Error accessing file ${id}:`, e)
          }
        }
        server.ws.send({
          type: 'full-reload',
          path: '*'
        })
      }
    }
  }
  return plugin
}
