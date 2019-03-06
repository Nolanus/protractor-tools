import { promise, ProtractorBrowser } from 'protractor';
import { ISize } from 'selenium-webdriver';
import { BaseUtil } from './base';

export class ResizeUtil extends BaseUtil {

  constructor(browser?: ProtractorBrowser) {
    super(browser);
  }

  /**
   * Convenience function to set the size of the browser window size in pixels
   *
   * @param width The window width to set
   * @param height The window height to set
   * @returns {promise.Promise<void>} Promise resolving once the browser window size has been changed
   */
  public setWindowSize(width: number, height: number): promise.Promise<void> {
    return this.browser.manage().window().setSize(width, height);
  }

  /**
   * Convenience function to get the current window size
   *
   * @returns {promise.Promise<ISize>} Promise resolving to an object containing the width and height values of the browser window
   */
  public getWindowSize(): promise.Promise<ISize> {
    return this.browser.manage().window().getSize();
  }

  /**
   * Set the viewport area of the browser to the given amount of pixels.
   * This method takes sizes of navigation bars and similar into account and adjusts the browser window
   * accordingly to ensure the given size for the content.
   * @param width Width of the browser viewport
   * @param height Height of the browser viewport
   * @returns {Promise<void>}
   */
  public setViewportSize(width: number, height: number): promise.Promise<void> {
    const d = promise.defer<void>();

    this.getChromeSize().then((delta) => {
      this.setWindowSize(width + delta.width, height + delta.height).then(() => d.fulfill(), (err) => d.reject(err));
    });

    return d.promise;
  }

  /**
   * Get the current size of the browser viewport.
   * Viewport is the actual area of the browser window that displays content. Height and width
   * of navigation bars and similar elements get subtracted.
   *
   * @returns {promise.Promise<ISize>} Promise to be resolved with {width: number, height: number} containing the current viewport size
   */
  public getViewportSize(): promise.Promise<ISize> {
    const viewportSizesJs = 'return {height: window.document.documentElement.clientHeight, ' +
      'width: window.document.documentElement.clientWidth}';

    return <promise.Promise<ISize>>this.browser.driver.executeScript(viewportSizesJs);
  }

  /**
   * Return the vertical and horizontal space occupied by the browser chrome (user interface overhead that surrounds web page content)
   *
   * Note 1: This method is used when trying to set the viewport to a certain size by manipulating the browser window size
   * Note 2: A headless browser usually returns a width and/or height of 0 for this
   *
   * @returns {promise.Promise<ISize>}
   */
  public getChromeSize(): promise.Promise<ISize> {
    const d = promise.defer<ISize>();

    promise.fullyResolved([this.getWindowSize(), this.getViewportSize()]).then(([windowSize, viewportSize]: ISize[]) => {
      // Calculate the difference between viewport and window height/width
      d.fulfill({height: windowSize.height - viewportSize.height, width: windowSize.width - viewportSize.width});
    });

    return d.promise;
  }

}
