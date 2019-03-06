import { AppPage } from './app.po';
import { ConsoleUtil } from 'protractor-tools';

describe('Console inspection demo App', () => {
  let page: AppPage;

  const consoleUtil = new ConsoleUtil();

  beforeEach(() => {
    page = new AppPage();
  });

  afterEach(consoleUtil.expectNoConsoleErrors(true));

  /**
   * This test does produce console logging, but no errors. Thus the test passes
   */
  it('should check the console for errors after every run and continue', () => {
    page.navigateTo();
    page.wait();
    page.getConsoleLogButton().click();
    page.wait();
  });

  /**
   * Remove skipping that test case to see it failing, as it produces a console error
   */
  xit('should detect the console error produced and fail', () => {
    page.navigateTo();
    page.wait();
    page.getConsoleErrorButton().click();
    page.wait();
  });

  /**
   * This test does produce console warning, but no errors. Thus the test passes, even when the second
   * test case in the test suite produces and error and fails.
   */
  it('should not fail if a spec produces a warning', () => {
    page.navigateTo();
    page.wait();
    page.getConsoleWarnButton().click();
    page.wait();
  });
});
