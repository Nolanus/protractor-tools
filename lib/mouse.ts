import { ProtractorBrowser, WebElement, promise } from 'protractor';
import { ILocation } from 'selenium-webdriver';
import { BaseUtil } from './base';

export class MouseUtil extends BaseUtil {

  constructor(browser?: ProtractorBrowser) {
    super(browser);
  }

  /**
   * Execute a drag-and-drop action.
   *
   * Note: HTML5 drag-and-drop does not always work in chrome (https://github.com/angular/protractor/issues/583)
   *
   * @param from Position or element to start dragging
   * @param to Position or element to strop dragging and drop
   * @returns {promise.Promise<void>} Promise resolving after the action has been performed
   */
  public drag(from: WebElement | ILocation, to: WebElement | ILocation): promise.Promise<void> {
    return this.browser.actions().mouseMove(from).mouseDown().mouseMove(to).mouseUp().perform();
  }
}
