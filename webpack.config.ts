import { Configuration } from 'webpack'

const config: Configuration = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      }
    ]
  }
}

export default config
