/*global casper require */

var select = require('casper').selectXPath;

casper.test.begin('Testing workflow list page', function suite(test) {
    casper.start(casper.options.BASE_URL + '/workflows');

    // wait for rendering and then test and click
    casper.waitForSelector('.workflows .table-row', function success() {
      test.assertExists('td[data-search="arraytest"]', 'ARRAYTEST exists');
      this.click('td[data-search="arraytest"]');
			}, null, 10000);

    // Test Workflow detail pane
    // wait for ARRAYTEST detail pane
    casper.echo('Testing workflow detail right pane');
    casper.waitForSelector('#heading .selectable', function () {
      test.assertSelectorHasText('#heading .selectable', 'ARRAYTEST');
    });

    // test tabs

    // show tab Steps
    casper.then(function () {
      this.click('a[data-target="#steps"]');
      test.assertVisible('#workflow-detail .box');
      this.click(select('//a[text()="test_function_1"]'));
    });

    // check modal with source code
    casper.waitUntilVisible('div.modal', function () {
      test.assertSelectorHasText('#modalHeader', 'test_function_1');
      this.echo('Closing function modal');
      this.click('div.modal button.close');
    });

    casper.waitWhileVisible('div.modal', function () {
      test.assertNotVisible('div.modal');
    });

    casper.then(function () {
      this.click('a[data-target="#log"]');
      test.assertVisible('#workflow-detail .log-area');
    });

    casper.then(function () {
      this.click('a[data-target="#library"]');
      test.assertExists('#library');
      test.assertSelectorHasText('#workflow-detail a[data-target="#doTest"]', 'doTest');
    });

    casper.run(function() {
        test.done();
    });
});
