import * as webpack from 'webpack'
import * as merge from 'webpack-merge'
import * as WebpackDevServer from 'webpack-dev-server'
import genWebpackConf from './lib/genWebpackConf'
import { sync as rm } from 'rimraf'

process.env.NODE_ENV = 'development'

const isNoModuleBuild = process.argv.includes('--nomodule')

const config = merge(genWebpackConf(false, false, isNoModuleBuild, isNoModuleBuild ? 'es5' : undefined), {
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})

const options:WebpackDevServer.Configuration = {
  hot: true,
  host: '0.0.0.0',
}

rm('dist')

WebpackDevServer.addDevServerEntrypoints(config, options)
const compiler = webpack(config)
const server = new WebpackDevServer(compiler, options)

server.listen(5000, '0.0.0.0', () => {
  console.log('dev server listening on http://0.0.0.0:5000')
})
