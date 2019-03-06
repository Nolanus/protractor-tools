import { inspect } from 'util';
import { ProtractorBrowser, promise } from 'protractor';
import { logging } from 'selenium-webdriver';
import { BaseUtil } from './base';

export class ConsoleUtil extends BaseUtil {

  constructor(browser?: ProtractorBrowser) {
    super(browser);
  }

  /**
   * Get the browser console logs.
   *
   * NOTE: Retrieving the logs from the browser clears the console afterwards. Thus calling this method in a test could
   * render the usage of {@link expectNoConsoleErrors()} and {@link expectNoConsoleWarnings()} in "afterEach" useless,
   * as they would not retrieve the whole console logs produced while executing the text case.
   *
   * @returns {promise.Promise<logging.Entry[]>}
   */
  public getLogs(): promise.Promise<logging.Entry[]> {
    return this.browser.manage().logs().get('browser');
  }

  /**
   * Provides a function to be passed to jasmine's afterEach() function.
   * The function will check that no message is logged to the console that
   * has a log level higher than or equal to the provided threshold
   * @param filter A method that determines which log is considered relevant or not
   * @param logMatches indicate whether all matched logs should be printed to the protractor console or not. Default is false.
   * @returns {(done:DoneFn)=>void} A function to be passed to jasmine's afterEach()
   */
  public expectNoConsoleLogs(filter: (log: logging.Entry) => boolean, logMatches = false): (done: DoneFn) => void {
    return (done: DoneFn) => {
      this.browser.manage().logs().get('browser').then((browserLog: logging.Entry[]) => {
        let relevantLogs = browserLog.filter(filter);
        if (relevantLogs.length > 0) {
          if (logMatches) {
            console.log('Console logs:');
            console.log(inspect(relevantLogs));
          }
          done.fail('Detected ' + relevantLogs.length + ' unexpected console log(s): '
            + JSON.stringify(relevantLogs[0].message).substr(0, 250));
        } else {
          done();
        }
      });
    };
  }

  /**
   * Shorthand function to check for error logs in the console
   * after each test case.
   * Use like: afterEach(consoleUtil.expectNoConsoleErrors());
   * If a error message has been found in the logs, the test case
   * will be marked as failed and an excerpt from the logged error will be printed.
   *
   * @param logMatches indicate whether all matched logs should be printed to the protractor console or not. Default is false.
   * @returns {(done:DoneFn)=>void}
   */
  public expectNoConsoleErrors(logMatches?: boolean) {
    return this.expectNoConsoleLogs(log => log.level.value >= 1000, logMatches);
  }

  /**
   * Shorthand function to check for warning or error logs in the console
   * after each test case.
   * Use like: afterEach(consoleUtil.expectNoConsoleWarnings());
   * If a warning or error message has been found in the logs, the test case
   * will be marked as failed and an excerpt from the logged warning will be printed.
   *
   * @param logMatches indicate whether all matched logs should be printed to the protractor console or not. Default is false.
   * @returns {(done:DoneFn)=>void}
   */
  public expectNoConsoleWarnings(logMatches?: boolean) {
    return this.expectNoConsoleLogs(log => log.level.value >= 900, logMatches);
  }
}
