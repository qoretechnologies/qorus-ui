module.exports = function releasesSteps() {
  this.Given(/^releases get loaded$/, async function() {
    await this.waitForElement('.tree-component');

    return this.browser.assert.element('.tree-component');
  });

  this.Then(/^there are (\d+) releases shown$/, async function(count) {
    return this.browser.assert.elements('.tree-wrapper > .tree-top', parseInt(count, 10));
  });

  this.Then(/^releases are sorted by name descending$/, async function() {
    const rls = this.browser.queryAll('.tree-wrapper > .tree-top');

    this.browser.assert.text(rls[0], '2015-10-13 12:50:16 - qorus-user-isepl-IE1503-20151013');
    this.browser.assert.text(rls[8], '2016-01-04 12:30:52 - qorus-3.1.0_git');
  });

  this.Then(/^releases are sorted by date ascending/, async function() {
    const rls = this.browser.queryAll('.tree-wrapper > .tree-top');

    this.browser.assert.text(rls[0], '2015-06-25 14:19:06 - qorus-3.1.0_svn-trunk');
    this.browser.assert.text(rls[8], '2016-07-25 16:56:38 - qorus-user-isepl-GB160275-20160725');
  });
};
