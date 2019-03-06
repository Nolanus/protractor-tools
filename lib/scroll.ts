import { ElementFinder, promise, ProtractorBrowser } from 'protractor';
import { BaseUtil } from './base';

export class ScrollUtil extends BaseUtil {

  constructor(browser?: ProtractorBrowser) {
    super(browser);
  }

  /**
   * Vertically scroll the top-left corner of the given element (y-axis) into viewport.
   * @param scrollToElement
   * @returns {Promise<void>}
   */
  public scrollTo(scrollToElement: ElementFinder): promise.Promise<void> {
    let d = promise.defer<void>();
    scrollToElement.getLocation().then((loc) => {
      this.browser.driver.executeScript('window.scrollTo(0, arguments[0]);', loc.y)
        .then(() => d.fulfill(), (err) => d.reject(err));
    });

    return d.promise;
  }

  /**
   * Scroll to a given position (coordination), specified in pixels in x- and y-axis
   * @param x Coordinate in pixels to scroll to horizontal direction (x-axis)
   * @param y Coordinate in pixels to scroll to vertical direction (y-axis)
   * @returns {Promise<void>}
   */
  public scrollToPosition(x: number, y: number): promise.Promise<void> {
    return this.browser.driver.executeScript('window.scrollTo(arguments[0], arguments[1]);', x, y);
  }

  /**
   * Scroll to a given number of pixels
   * @param x Number of pixels to scroll in horizontal direction (x-axis)
   * @param y Number of pixels to scroll in vertical direction (y-axis)
   * @returns {Promise<void>}
   */
  public scrollBy(x: number, y: number): promise.Promise<void> {
    return this.browser.driver.executeScript('window.scrollBy(arguments[0], arguments[1]);', x, y);
  }
}
