import { AppPage } from './app.po';
import { MemoryUtil } from 'protractor-tools';
import { map } from 'rxjs/operators';

describe('Memory demo App', () => {
  let page: AppPage;

  beforeAll(() => {
    page = new AppPage();
  });

  const memoryUtil = new MemoryUtil();

  memoryUtil.performanceTest('clicking the button without cleanup', () => {
    page.getAllocateMemoryButton().click();
  }, {
    iterations: 25,
    preTestInit: () => {
      page.navigateTo();
    }
  }).pipe(map(MemoryUtil.csvMapper)).subscribe(MemoryUtil.fileWriter('perf/withoutCleanup.csv'));

  memoryUtil.performanceTest('clicking the button with cleanup', () => {
    page.getAllocateMemoryButton().click();
  }, {
    iterations: 25,
    preTestInit: () => {
      page.navigateTo();
    },
    postTestComplete: () => {
      page.getFreeShelfButton().click();
    }
  }).pipe(map(MemoryUtil.csvMapper)).subscribe(MemoryUtil.fileWriter('perf/withCleanup.csv'));

});
