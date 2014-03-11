/*global casper */

casper.test.begin('Testing workflow list page', 6, function suite(test) {
    casper.start(casper.options.BASE_URL + '/workflows');

    // navigate to workflows
    casper.then(function() {
      this.click('a[href="/workflows"]');
    });

    // wait for rendering and then test and click
    casper.waitForSelector('.workflows .table-row', function() {
      test.assertExists('td[data-search="arraytest"]', 'ARRAYTEST exists');
      this.click('td[data-search="arraytest"]');
    });

    // wait for ARRAYTEST detail pane
    casper.waitForSelector('#workflow-detail', function () {
      test.assertSelectorHasText('#heading .selectable', 'ARRAYTEST');
    });

    // test tabs

    casper.then(function () {
      this.click('a[data-target="#steps"]');
      test.assertVisible('#workflow-detail .box');
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