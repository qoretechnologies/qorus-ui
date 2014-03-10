var x = require('casper').selectXPath;

casper.test.begin('Workflow list page', 3, function suite(test) {
    casper.start("http://localhost:8080/");
    
    // check if dashboard is loaded
    casper.waitForSelector('#dashboard', function () {
      test.assertExists('#dashboard', 'Dashboard exists');
    });

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

    casper.run(function() {
        test.done();
    });
});