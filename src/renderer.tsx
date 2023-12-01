import 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { title?: string }): Response
  }
}

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <link href="/static/style.css" rel="stylesheet" />
        <title>{title ?? 'R2 Blog'}</title>
      </head>
      <body>
        <h1>
          <a href="/">R2 Blog</a>
        </h1>
        {children}
      </body>
    </html>
  )
})
