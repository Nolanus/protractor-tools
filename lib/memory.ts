import { dirname, resolve } from 'path';
import { execSync } from 'child_process';
import { createWriteStream, ensureDirSync, writeFileSync, WriteStream } from 'fs-extra';
import { promise, ProtractorBrowser } from 'protractor';
import { Observable, Observer, Subscriber } from 'rxjs';
import { BaseUtil } from './base';

const quiche = require('quiche');

export interface MemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

export interface PerformanceTestOptions {
  /**
   * Whether the performance test suite should be a
   * focused jasmine test suite. Default is false
   */
  focused?: boolean;
  /**
   * Milliseconds to sleep after GC before iterations start.
   * Default is 2500
   */
  initialPostGcSleep?: number;
  /**
   * Number of iterations to be performed.
   * Default is 100
   */
  iterations?: number;
  /**
   * Milliseconds to sleep before final GC after all iterations happened.
   * Default is 1500
   */
  finalPostTestSleep?: number;
  /**
   * Milliseconds to sleep between last GC and final memory measurement
   * Default is 4500
   */
  finalPostGcSleep?: number;
  writeLogFile?: boolean;
  writeCsvFile?: boolean;
  generateGraph?: boolean;

  /**
   * Called between initial GC and the start of the test
   */
  preTestInit?(): void;

  /**
   * Called between the final GC and memory measurement
   */
  postTestComplete?(): void;
}

export interface PerformanceReport {
  iteration: number;
  date: Date;
  memory?: MemoryInfo;
  gc?: boolean | undefined;
}

export class MemoryUtil extends BaseUtil {

  private performanceTestDefaultOptions: PerformanceTestOptions = {
    focused: false,
    initialPostGcSleep: 2500,
    iterations: 100,
    finalPostTestSleep: 1500,
    finalPostGcSleep: 4500,
    writeLogFile: true,
    writeCsvFile: true,
    generateGraph: true,
    preTestInit: () => {
    },
    postTestComplete: () => {
    },
  };

  private static copyDefaults(src: any, target: any = {}) {
    // Copy over default option values
    Object.keys(src).forEach((key: string) => {
      if (target[key] === undefined || target[key] === null) {
        target[key] = src[key];
      }
    });

    return target;
  }

  public static csvMapper = (value: PerformanceReport, index: number) => {
    return `${value.iteration},${value.date.toString()},` +
      (value.memory
        ? `${value.memory.usedJSHeapSize},${value.memory.totalJSHeapSize},${value.memory.jsHeapSizeLimit}`
        : ',,') +
      `,${!!value.gc}`;
  }

  public static fileWriter(filename: string): Subscriber<string> {
    ensureDirSync(dirname(filename));

    let stream: WriteStream = null;

    return Subscriber.create((value: string) => {
        if (stream === null) {
          stream = createWriteStream(filename);
        }
        stream.write(value);
        stream.write('\n');
      },
      (err) => {
        stream.end();
        throw err;
      },
      () => {
        stream.end();
      });
  }

  public static chartWriter(filename: string, title = 'Memory performance'): Subscriber<PerformanceReport[]> {
    ensureDirSync(dirname(filename));

    return Subscriber.create((value: PerformanceReport[]) => {
      const chart: any = quiche('line');
      chart.setTitle(title);

      let data: { usedJSHeapSize: number[], totalJSHeapSize: number[] } = {
        usedJSHeapSize: [],
        totalJSHeapSize: [],
      };

      value.forEach((item) => {
        if (item.memory) {
          // Add the data, but shrink the numbers a little as the precise values are not that important,
          // but it will reduce the image url length
          data.usedJSHeapSize.push(Math.round(item.memory.usedJSHeapSize / 100000));
          data.totalJSHeapSize.push(Math.round(item.memory.totalJSHeapSize / 100000));
        }
      });

      chart.setWidth(440);
      chart.setHeight(220);
      chart.setLegendBottom();
      chart.addData(data.usedJSHeapSize, 'Used JS Heap', '03a9f4', 1, 0, 0);
      chart.addData(data.totalJSHeapSize, 'Total JS Heap', 'ff9800', 1, 6, 3);

      // Utilize the array keys for the x axis
      chart.addAxisLabels('x', Object.keys(data.usedJSHeapSize));
      chart.setAutoScaling();

      let chartUrl = chart.getUrl(true);
      let command = 'curl ' + chartUrl;
      console.log(command);
      writeFileSync(resolve(filename), execSync(command, {encoding: 'binary'}), 'binary');
      console.log('Graph created');
    });
  }

  constructor(browser?: ProtractorBrowser) {
    super(browser);
  }

  public isChrome(): promise.Promise<boolean> {
    return this.browser.driver.executeScript('return navigator.userAgent.indexOf(\'Chrome/\') !== -1;');
  }

  public measure(): promise.Promise<MemoryInfo> {
    return this.browser.driver.executeScript('return window.performance.memory;');
  }

  public garbageCollectAvailable(): promise.Promise<boolean> {
    return this.browser.driver.executeScript('return typeof window.gc === "function";');
  }

  public garbageCollect(): promise.Promise<void> {
    return this.browser.driver.executeScript('return window.gc();');
  }

  /**
   * Perform a certain action multiple times and measure the memory consumption between the iterations.
   * Triggers garbage collection before the first iteration and after the last one to identify possible
   * memory leaks.
   *
   * Note 1: Ensure that the started browser supports garbage collection, use {@link MemoryUtil#garbageCollectAvailable()}
   * Note 2: Subscribe to the returned observable in order to execute the tests!
   *
   * @param expectation descriptive text of the action being performed, will be used as testSuite name
   * @param assertion function to be performed each iteration
   * @param options
   * @param timeout
   * @returns {Observable<{date: Date, memory?: MemoryInfo, gc?: boolean}>}
   */
  public performanceTest(expectation: string,
                         assertion: () => void,
                         options: PerformanceTestOptions = {},
                         timeout?: number): Observable<PerformanceReport> {
    return new Observable((observer: Observer<PerformanceReport>) => {
      const handleMeasureResult = (iteration: number) => {
        return (memoryInfo: MemoryInfo) => {
          observer.next({iteration, date: new Date(), memory: memoryInfo});
        };
      };

      options = MemoryUtil.copyDefaults(this.performanceTestDefaultOptions, options);

      (options.focused ? fdescribe : describe)(expectation, () => {

        let iteration = 0;
        beforeEach(() => {
          iteration = ++iteration;
          if (iteration === 1) {
            // First iteration, collect garbage and sleep a while afterwards
            this.garbageCollect().then(() => observer.next({iteration, date: new Date(), gc: true}));
            this.browser.sleep(options.initialPostGcSleep);
            this.measure().then(handleMeasureResult(iteration));
            options.preTestInit();
          }
        }, 10000);

        for (let i = 1; i <= options.iterations; ++i) {
          it('Iteration ' + i, () => {
            assertion();
            this.measure().then(handleMeasureResult(iteration));
          }, timeout);
        }

        afterEach(() => {
          if (iteration === options.iterations) {
            // Last iteration
            this.browser.sleep(options.finalPostTestSleep);
            this.garbageCollect().then(() => observer.next({iteration, date: new Date(), gc: true}));
            options.postTestComplete();
            this.browser.sleep(options.finalPostGcSleep);
            this.measure().then(handleMeasureResult(iteration)).then(() => observer.complete());
          }
        }, 10000);
      });

    });
  }
}
