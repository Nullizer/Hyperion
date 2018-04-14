import { Configuration } from 'webpack'
import * as merge from 'webpack-merge'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'

const isProd = process.env.NODE_ENV === 'production'

const commonConfig: Configuration = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.scss$/,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', {
          loader: 'css-loader',
          options: {
            modules: true,
            camelCase: true,
            localIdentName: '[name]-[local]_[hash:base64:4]',
            minimize: isProd,
          }
        }, {
          loader: 'sass-loader',
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hyperion',
      meta: { viewport: 'width=device-width, initial-scale=1.0' },
      minify: {
        collapseWhitespace: isProd
      }
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  },
}

const devConfig = merge(commonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
})

const prodConfig = merge(commonConfig, {
  mode: 'production',
  devtool: false,
  plugins: [
    new MiniCssExtractPlugin(),
  ],
})

export default isProd ? prodConfig : devConfig
