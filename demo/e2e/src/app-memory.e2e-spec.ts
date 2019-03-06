import { AppPage } from './app.po';
import { MemoryUtil } from 'protractor-tools';

describe('Memory demo App', () => {
  let page: AppPage;

  const memoryUtil = new MemoryUtil();

  beforeEach(() => {
    page = new AppPage();
  });

  it('should consume some memory', () => {
    page.navigateTo();
    memoryUtil.measure().then(memoryUsage => {
      expect(Object.keys(memoryUsage).length).toBe(3, 'memory report should have three properties');
      expect(memoryUsage.usedJSHeapSize).toBeGreaterThan(0, 'the app should be using at least some memory');
      expect(memoryUsage.totalJSHeapSize).toBeGreaterThanOrEqual(memoryUsage.usedJSHeapSize,
        'totalHeapSize should be larger than what we\'re currently using');
      expect(memoryUsage.jsHeapSizeLimit).toBeGreaterThanOrEqual(memoryUsage.totalJSHeapSize, 'We should be below the heapSizeLimit');
    });
  });

  it('should detect increased memory consumption', () => {
    page.navigateTo();
    memoryUtil.measure().then(initialMemoryUsage => {
      page.getAllocateMemoryButton().click();
      memoryUtil.measure().then(memoryUsage => {
        expect(memoryUsage.usedJSHeapSize).toBeGreaterThan(initialMemoryUsage.usedJSHeapSize);
        expect(memoryUsage.totalJSHeapSize).toBeGreaterThanOrEqual(initialMemoryUsage.totalJSHeapSize);
      });
    });
  });

  it('should try collecting garbage', () => {
    page.navigateTo();
    memoryUtil.garbageCollectAvailable().then((gcAvail) => {
      memoryUtil.garbageCollect().then((status) => {
        if (gcAvail) {
          expect(status).toBeNull('Calling gc() should return nothing');
        } else {
          // GC should not be available but it was callable
          fail('It should fail calling window.gc() as it\'s not available usually');
        }
      }, (err) => {
        if (gcAvail) {
          // GC should be available but it failed
          fail(err);
        } else {
          // GC should not be available and calling it failed
          expect(err.toString()).toContain('window.gc is not a function', 'garbage collection should fail due to not being a function');
        }
      });
    });
  });
});
