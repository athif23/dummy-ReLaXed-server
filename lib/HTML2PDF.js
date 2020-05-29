import { masterToPDF } from './masterToPDF.js';
const chromium = require('puppeteer');
const plugins = require('relaxedjs/src/plugins');
const path = require('path');

class HTML2PDF {
  constructor() {
    this.puppeteerConfig = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-translate',
        '--disable-extensions',
        '--disable-sync',
      ],
    };

    this.relaxedGlobals = {
      busy: false,
      config: {},
      configPlugins: [],
    };

    this._initializedPlugins = false;
  }

  async _initializePlugins(excludedPlugins = []) {
    if (this._initializedPlugins) return; // Do not initialize plugins twice
    for (const [i, plugin] of plugins.builtinDefaultPlugins.entries()) {
      if (excludedPlugins.includes(i))
      plugins.builtinDefaultPlugins[i] = await plugin.constructor();
    }
    await plugins.updateRegisteredPlugins(this.relaxedGlobals, '/');

    const chrome = await chromium.launch(this.puppeteerConfig);
    this.relaxedGlobals.puppeteerPage = await chrome.newPage();
    this._initializedPlugins = true;
  }

  async pdf(templatePath, json_data, tempHtmlPath, outputPdfPath) {
    await this._initializePlugins();
    if (this._initializedPlugins) {
      // Paths must be absolute
      const defaultTempHtmlPath = tempHtmlPath || path.resolve('temp.html');
      const defaultOutputPdfPath =
        outputPdfPath || path.resolve('output.pdf');

      await masterToPDF(
        templatePath,
        this.relaxedGlobals,
        defaultTempHtmlPath,
        defaultOutputPdfPath,
        json_data
      );
    }
  }
}

export default HTML2PDF = new HTML2PDF();