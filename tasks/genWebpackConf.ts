import { Configuration, RuleSetRule } from 'webpack'
import * as merge from 'webpack-merge'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import TwiceBuildPlugin from './TwiceBuildPlugin'
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const getLocalIdent = require('css-loader/lib/getLocalIdent')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

export default function (isProd: boolean, inTwiceBuild: boolean, target?: 'es5'): Configuration {
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

  let config: Configuration = {
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
          use: [ inTwiceBuild ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                camelCase: true,
                // localIdentName: '[name]-[local]_[hash:base64:4]',
                localIdentName: '[name]-[local]',
                getLocalIdent: (loaderContext: any, localIdentName: string, localName: string, options: object) => {
                  // https://github.com/css-modules/css-modules/pull/65
                  return loaderContext.resourcePath.includes('global')
                    ? localName : getLocalIdent(loaderContext, localIdentName, localName, options)
                },
                minimize: isProd,
                importLoaders: 2,
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')({ grid: true }),
                ]
              }
            },
            'sass-loader'
          ]
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

  if (inTwiceBuild) {
    config = merge(config, {
      plugins: [
        new TwiceBuildPlugin(),
      ]
    })
  }

  if (isProd) {
    config = merge(config, {
      plugins: [
        new OptimizeCssAssetsPlugin(),
      ]
    })
  }

  return config
}
