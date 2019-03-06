import { browser, ProtractorBrowser } from 'protractor';

export class BaseUtil {

  protected browser: ProtractorBrowser;

  constructor(_browser?: ProtractorBrowser) {
    if (_browser === null || _browser === undefined) {
      this.browser = browser;
    } else {
      this.browser = _browser;
    }
  }
}
