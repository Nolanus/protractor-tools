import { AppPage } from './app.po';
import { ResizeUtil } from 'protractor-tools';
import { ISize } from 'selenium-webdriver';

describe('Resizing demo App', () => {
  let page: AppPage;

  const resizeUtil = new ResizeUtil();

  beforeEach(() => {
    page = new AppPage();
  });

  it('should resize the browser window a little', () => {
    page.navigateTo();
    page.wait();
    resizeUtil.setWindowSize(1303, 876);
    expect(resizeUtil.getWindowSize()).toEqual({width: 1303, height: 876});
    page.wait();
    resizeUtil.setViewportSize(640, 400);
    page.wait();
    resizeUtil.getWindowSize().then((windowSize: ISize) => {
      expect(windowSize.height).toBeGreaterThan(400);
      expect(windowSize.width).toBeGreaterThanOrEqual(640);
    });
  });

});
