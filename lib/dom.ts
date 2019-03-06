import { ProtractorBrowser, promise, ElementFinder } from 'protractor';
import { WebdriverWebElement } from 'protractor/built/element';
import { BaseUtil } from './base';

export class DomUtil extends BaseUtil {

  constructor(browser?: ProtractorBrowser) {
    super(browser);
  }

  public waitForNotDisplayed(element: ElementFinder, timeout = 1000): promise.Promise<boolean> {
    return this.browser.wait(() => {
      let d = promise.defer<boolean>();

      (<WebdriverWebElement>element).isDisplayed().then((isDisplayed: boolean) => {
        d.fulfill(!isDisplayed);
      });

      return d.promise;
    }, timeout);
  }

  public waitForDisplayed(element: ElementFinder, timeout = 1000): promise.Promise<boolean> {
    return this.browser.wait((<WebdriverWebElement>element).isDisplayed, timeout);
  }
}
