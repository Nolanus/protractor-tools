import { AppPage } from './app.po';
import { DomUtil } from 'protractor-tools';

describe('Dom demo App', () => {
  let page: AppPage;

  const domUtil = new DomUtil();

  beforeEach(() => {
    page = new AppPage();
  });

  it('should detect elements being displayed or not', () => {
    page.navigateTo();
    page.wait();
    page.getAngularLogo().isDisplayed().then((isDisplayed) => {
      page.getToggleVisibilityButton().click();
      const angularLogo = page.getAngularLogo();
      if (isDisplayed) {
        domUtil.waitForNotDisplayed(angularLogo, 6500).then(() => console.log('Logo has just vanished'));
      } else {
        domUtil.waitForDisplayed(angularLogo, 6500).then(() => console.log('Logo has just become visible again'));
      }
    });
  });
});
