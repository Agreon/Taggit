import { TaggitFrontendPage } from './app.po';

describe('taggit-frontend App', () => {
  let page: TaggitFrontendPage;

  beforeEach(() => {
    page = new TaggitFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
