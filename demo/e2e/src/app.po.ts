import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

  getAngularLogo() {
    return element(by.css('app-root img'));
  }

  getParagraph() {
    return element(by.css('app-root h1'));
  }

  getParagraphText() {
    return this.getParagraph().getText();
  }

  getConsoleLogButton() {
    return element(by.css('#consoleLogButton'));
  }

  getConsoleWarnButton() {
    return element(by.css('#consoleWarnButton'));
  }

  getConsoleErrorButton() {
    return element(by.css('#consoleErrorButton'));
  }

  getToggleVisibilityButton() {
    return element(by.css('#toggleVisibility'));
  }

  getAllocateMemoryButton() {
    return element(by.css('#allocateMemory'));
  }

  getFreeShelfButton() {
    return element(by.css('#freeShelf'));
  }

  getSubHeading() {
    return element(by.css('#subheading'));
  }

  wait() {
    browser.sleep(2500);
  }
}
