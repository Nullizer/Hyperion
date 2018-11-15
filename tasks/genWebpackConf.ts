import { Configuration, RuleSetRule } from 'webpack'
import * as merge from 'webpack-merge'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import TwiceBuildPlugin from './TwiceBuildPlugin'
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

export default function (isProd: boolean, inBuild: boolean, target?: 'es5'): Configuration {
  const tsRule: RuleSetRule = {
    test: /\.tsx?$/,
    loader: 'ts-loader',
  }
  if (target) {
    tsRule.options = {
      compilerOptions: {
        target,
      }
    }
  }

  const config: Configuration = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'cheap-module-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    output: {
      filename: isProd ? (target ? `[name].[chunkhash].${target}.js` : '[name].[chunkhash].js')
        : (target ? `[name].${target}.js` : '[name].js')
    },
    // externals: {
    //   react: 'React',
    //   'react-dom': 'ReactDOM',
    // },
    module: {
      rules: [
        tsRule,
        {
          test: /\.scss$/,
          use: [ inBuild ? MiniCssExtractPlugin.loader : 'style-loader', {
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
        template: 'src/index.html',
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
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: true
    },
  }

  if (inBuild) {
    return merge(config, {
      plugins: [
        new TwiceBuildPlugin()
      ]
    })
  }
  return config
}
