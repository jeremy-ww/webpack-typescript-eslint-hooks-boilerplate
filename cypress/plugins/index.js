/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  if (config.testingType === 'component') {
    const { startDevServer } = require('@cypress/webpack-dev-server');
    const webpackConfig = require('../webpack.config.js');
    on('dev-server:start', (options) => startDevServer({ options, webpackConfig }));
  }

  require('@cypress/code-coverage/task')(on, config);

  // https://on.cypress.io/browser-launch-api
  // https://peter.sh/experiments/chromium-command-line-switches/
  on('before:browser:launch', (browser = {}, launchOptions) => {
    const width = 1792;
    const height = 1080;

    if (browser.name === 'chrome' && !browser.isHeadless) {
      launchOptions.args.push(`--window-size=${width},${height}`);
      launchOptions.args.push('--auto-open-devtools-for-tabs');
      launchOptions.preferences.default['preference'] = true;
    }

    return launchOptions;
  });

  return config;
};
