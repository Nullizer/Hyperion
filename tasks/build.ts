import { Configuration } from 'webpack'
import * as webpack from 'webpack'
import { sync as rm } from 'rimraf'
import genWebpackConf from './lib/genWebpackConf'

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

async function main () {
  try {
    rm('dist')
    await build(genWebpackConf(isProd, true, false, 'es5'))
    await build(genWebpackConf(isProd, true, true))
  } catch (error) {
    console.error('Error capture in main: ', error)
  }
}

main()
