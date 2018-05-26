import * as merge from 'webpack-merge'
import { commonConfig, isProd } from './webpack.config.base'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'

const devConfig = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
})

const prodConfig = merge(commonConfig, {
  mode: 'production',
  devtool: false,
  output: {
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
  ],
})

export default isProd ? prodConfig : devConfig
