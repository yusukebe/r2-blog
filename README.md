# R2 Blog

R2 Blog is an experimental blogging system that uses Cloudflare R2 as its backend file system for storing Markdown files.

## Stack

- Cloudflare Pages
- Cloudflare R2
- Hono
- Vite

## Motivation

For Cloudflare Workers/Pages SSR, how do you implement your blogging system with contents in Markdown files?

One option is to bundle them into a single JavaScript file. However, as the content grows, the size of this bundle could become increased.

In this project, Cloudflare R2 is used as a kind of file system. With the Vite Plugin "_Local2R2_", you can manage Markdown files as if they were on a local file system, even though they're stored in local Cloudflare R2.

## Vite Plugin "Local2R2"

In the development phase, you can write your articles in Markdown format, place the files in the `./contents` directory, and they will automatically be added to the local Cloudflare environment. This setup allows you to preview your work with hot-reloading.

To enable this, the project includes [a Vite plugin called "_Local2R2_"](plugins/local2r2.ts). This plugin is designed to watch a specified directory in the config. Whenever a file in this directory is updated, the plugin refreshes and uploads the file to a local R2 storage, which is emulated by Miniflare.

"_Local2R2_" might be distributed as an independent package.

## Screen Cast

![screen cast](https://github.com/yusukebe/r2-blog/assets/10682/9f2b1e07-38a0-4ac0-ae5f-b30e543dc361)

## Demo

- <https://r2-blog.pages.dev/>

## Usage

### Installation

```txt
git clone git@github.com:yusukebe/r2-blog.git
cd r2-blog
npm i
```

### Development

```txt
npm run dev
```

### Deploying

```txt
npm run deploy
```

### Uploading a Markdown file

```txt
wrangler r2 object put r2-blog/first.md -f ./contents/first.md
```

## Author

Yusuke Wada <https://github.com/yusukebe>

## License

MIT
