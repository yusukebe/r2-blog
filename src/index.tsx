import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { renderer } from './renderer'
import { micromark } from 'micromark'
import frontMatter from './front-matter'

type Env = {
  Bindings: {
    BUCKET: R2Bucket
  }
}

const app = new Hono<Env>()
app.get('*', etag({ weak: true }))
app.get('*', renderer)

app.get('/', async (c) => {
  const listed = await c.env.BUCKET.list()
  return c.render(
    <ul>
      {listed.objects.reverse().map((file) => {
        return (
          <li>
            <a href={`/files/${file.key}`}>{file.key}</a> - {file.uploaded.toDateString()}
          </li>
        )
      })}
    </ul>
  )
})

app.get('/files/:id', async (c) => {
  const file = await c.env.BUCKET.get(c.req.param('id'))
  if (file) {
    const text = await file.text()
    const info = frontMatter(text)
    const html = micromark(info.body)
    return c.render(<div dangerouslySetInnerHTML={{ __html: html }} />, {
      title: info.head.split(':')[1]
    })
  } else {
    c.status(404)
    return c.render('not found')
  }
})

export default app
