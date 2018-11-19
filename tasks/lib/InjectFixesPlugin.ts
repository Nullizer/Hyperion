import { Compiler } from 'webpack'
import { AssetTagsData } from './def'
import { insert } from 'ramda'

export default class InjectFixesPlugin {
  apply (compiler: Compiler) {
    const ID = 'Inject-Fixes'
    compiler.hooks.compilation.tap(ID, compilation => {
      ;(compilation.hooks as any).htmlWebpackPluginAlterAssetTags.tapAsync(ID, async (data: AssetTagsData, cb: Function) => {
        this.injectPolyfill(data)
        cb()
      })

      ;(compilation.hooks as any).htmlWebpackPluginAfterHtmlProcessing.tap(ID, (data: AssetTagsData) => {
        data.html = data.html.replace(/\snomodule="">/g, ' nomodule>')
      })
    })
  }

  private injectPolyfill (data: AssetTagsData) {
    const index = data.body.findIndex(element => {
      if (element.attributes) {
        return element.attributes.nomodule
      } else {
        return false
      }
    })
    if (index !== -1) {
      data.body = insert(index, {
        tagName: 'script',
        closeTag: true,
        attributes: {
          src: 'https://cdn.polyfill.io/v2/polyfill.min.js?features=default,fetch&flags=gated',
          nomodule: ''
        }
      }, data.body)
    }
  }
}
