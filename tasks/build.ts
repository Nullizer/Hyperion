import { Configuration } from 'webpack'
import * as webpack from 'webpack'
import { sync as rm } from 'rimraf'
import * as jsdom from 'jsdom'
import genWebpackConf from './genWebpackConf'
import { writeFileSync } from 'fs'

const { JSDOM } = jsdom

async function build (webpackConfig: Configuration) {
  const compiler = webpack(webpackConfig)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      console.log(stats.toString({ colors: true }))

      if (err) {
        reject(err)
      }
      const info = stats.toJson()
      if (stats.hasErrors()) {
        reject(info.errors)
      }
      if (stats.hasWarnings()) {
        console.warn(info.warnings)
      }

      resolve()
    })
  })
}

const isProd = process.env.NODE_ENV === 'production'
const safariFix = `!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();`
const dest = 'dist/index.html'

async function main () {
  try {
    rm('dist')
    await build(genWebpackConf(isProd, 'src/index.html', true))

    const dom = await JSDOM.fromFile(dest)
    const document = dom.window.document
    const fixEl = document.createElement('script')
    fixEl.innerHTML = safariFix
    document.body.appendChild(fixEl)
    writeFileSync(dest, dom.serialize())

    await build(genWebpackConf(isProd, dest, true, 'es5'))
  } catch (error) {
    console.error('Error capture in main: ', error)
  }
}

main()
