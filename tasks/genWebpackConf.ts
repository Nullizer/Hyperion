import { Configuration, RuleSetRule } from 'webpack'
import * as merge from 'webpack-merge'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const extractCSSConf: Configuration = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
  ],
}

export default function (isProd: boolean, template: string, target?: 'es5'): Configuration {
  const tsRule: RuleSetRule = {
    test: /\.tsx?$/,
    loader: 'ts-loader',
  }
  if (target) {
    tsRule.options = {
      compilerOptions: {
        target: 'es5',
      }
    }
  }
  const commonConf: Configuration = {
    mode: isProd ? 'production' : 'development',
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    output: {
      filename: isProd ? (target ? '[name].[chunkhash].es5.js' : '[name].[chunkhash].js')
        : (target ? '[name].es5.js' : '[name].js')
    },
    module: {
      rules: [
        tsRule,
        {
          test: /\.scss$/,
          use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              // localIdentName: '[name]-[local]_[hash:base64:4]',
              localIdentName: '[name]-[local]',
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
        template,
        minify: {
          collapseWhitespace: isProd
        }
      }),
      new ScriptExtHtmlWebpackPlugin({
        custom: {
          test: /\.es5\.js$/,
          attribute: 'nomodule'
        },
        module: {
          test: /^(?!.*\.es5\.js$)/
        }
      })
    ],
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: true
    },
  }
  let config = commonConf
  if (isProd) {
    config = merge(config, extractCSSConf)
  }
  return config
}
