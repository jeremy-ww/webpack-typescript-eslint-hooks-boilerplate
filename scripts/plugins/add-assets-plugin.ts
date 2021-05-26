import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import cheerio from 'cheerio';

const PLUGIN_NAME = 'AlterAssetsPlugin';

export default class AlterAssetsPlugin {
  private assets: HtmlWebpackPlugin.HtmlTagObject[];

  constructor({ assets }: { assets: HtmlWebpackPlugin.HtmlTagObject[] }) {
    this.assets = assets || [];
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, this.handleCompilerCompilation);
  }

  private _handleCompilerCompilation = (compilation: webpack.Compilation) => {
    const htmlWebpackPluginHooks = HtmlWebpackPlugin.getHooks(compilation);

    htmlWebpackPluginHooks.alterAssetTagGroups.tapPromise(
      PLUGIN_NAME,
      this.handleHtmlPluginAlterAssetTagGroups.bind(this, compilation),
    );

    htmlWebpackPluginHooks.afterTemplateExecution.tapPromise(
      PLUGIN_NAME,
      this.handleAfterTemplateExecution.bind(this, compilation),
    );
  };

  public handleHtmlPluginAlterAssetTagGroups = async (
    compilation: webpack.Compilation,
    htmlPluginArgs: any,
  ) => {
    const result = {
      headTags: this.assets.concat(htmlPluginArgs.headTags),
      bodyTags: htmlPluginArgs.bodyTags,
    };

    return result;
  };

  handleAfterTemplateExecution = async (compilation: webpack.Compilation, htmlPluginArgs: any) => {
    const $ = cheerio.load(htmlPluginArgs.html);
    const frameWorkNode = $.root().find('script[src$="framework.js"]');
    if (frameWorkNode.length) {
      compilation.warnings.push(
        'ui-framework: duplicated imported, please remove it in your html file.',
      );
      frameWorkNode.remove();
    }
    htmlPluginArgs.html = $.html();
    return htmlPluginArgs;
  };
}
