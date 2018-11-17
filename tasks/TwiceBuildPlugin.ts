import { Compiler } from 'webpack'
import { join, basename, dirname } from 'path'
import { ensureDir, mkdirp, writeFile, readFile, remove, existsSync } from 'fs-extra'

interface AssetTagsData {
  head: any[]
  body: any[]
  html: string
}

export default class TwiceBuildPlugin {
  apply (compiler: Compiler) {
    const ID = 'twice-build'
    compiler.hooks.compilation.tap(ID, compilation => {
      ;(compilation.hooks as any).htmlWebpackPluginAlterAssetTags.tapAsync(ID, async (data: AssetTagsData, cb: Function) => {
        const tempFile = this.findTempFile(compiler, data)
        if (!existsSync(tempFile)) {
          await this.initalBuild(tempFile, data)
        } else {
          await this.finalBuild(tempFile, data)
        }
        cb()
      })

      ;(compilation.hooks as any).htmlWebpackPluginAfterHtmlProcessing.tap(ID, (data: AssetTagsData) => {
        data.html = data.html.replace(/\snomodule="">/g, ' nomodule>')
      })
    })
  }

  private async initalBuild (assetsFile: string, data: AssetTagsData) {
    await mkdirp(dirname(assetsFile))
    await writeFile(assetsFile, JSON.stringify(data.body))
  }

  private async finalBuild (assetsFile: string, data: AssetTagsData) {
    const assets = JSON.parse(await readFile(assetsFile, 'utf-8'))
    this.injectPolyfill(data)
    this.injectSafariNoModuleFix(data)
    data.body.push(...assets)
    await remove(assetsFile)
  }

  private findTempFile (compiler: Compiler, data: any): string {
    const targetDir = compiler.options.output!.path!
    ensureDir(targetDir)
    const htmlName = basename(data.plugin.options.filename)
    // Watch out for output files in sub directories
    const htmlPath = dirname(data.plugin.options.filename)
    return join(targetDir, htmlPath, `inintal-build-assets-${htmlName}.json`)
  }

  private injectSafariNoModuleFix (data: AssetTagsData) {
    // inject inline Safari 10 nomodule fix
    data.body.push({
      tagName: 'script',
      closeTag: true,
      innerHTML: safariFix,
      attributes: {
        nomodule: ''
      }
    })
  }

  private injectPolyfill (data: AssetTagsData) {
    data.body.push({
      tagName: 'script',
      closeTag: true,
      attributes: {
        src: 'https://cdn.polyfill.io/v2/polyfill.min.js?features=default,fetch&flags=gated',
        nomodule: ''
      }
    })
  }
}

const safariFix = `!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();`
