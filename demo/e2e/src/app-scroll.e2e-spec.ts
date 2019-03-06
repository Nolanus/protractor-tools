import { AppPage } from './app.po';
import { ScrollUtil } from 'protractor-tools';

describe('Scrolling demo App', () => {
  let page: AppPage;

  const scrollUtil = new ScrollUtil();

  beforeEach(() => {
    page = new AppPage();
  });

  it('should scroll to the sub heading and back up', () => {
    page.navigateTo();
    page.wait();
    scrollUtil.scrollTo(page.getSubHeading());
    page.wait();
    scrollUtil.scrollTo(page.getParagraph());
  });

});
