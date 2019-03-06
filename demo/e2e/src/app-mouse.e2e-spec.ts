import { AppPage } from './app.po';
import { MouseUtil } from 'protractor-tools';

describe('Mouse demo App', () => {
  let page: AppPage;

  const mouseUtil = new MouseUtil();

  beforeEach(() => {
    page = new AppPage();
  });

});
