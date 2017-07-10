import { OpenwhiskAngularPage } from './app.po';

describe('openwhisk-angular App', () => {
  let page: OpenwhiskAngularPage;

  beforeEach(() => {
    page = new OpenwhiskAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
