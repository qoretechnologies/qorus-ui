/*global casper require */

var x = require('casper').selectXPath;

casper.test.begin('Testing workflow list page', function suite(test) {
    casper.start(casper.options.BASE_URL + '/workflows');

    casper.waitForSelector(x("//a[normalize-space(text())='Export CSV']"),
        function success() {
            test.assertExists(x("//a[normalize-space(text())='Export CSV']"));
            this.click(x("//a[normalize-space(text())='Export CSV']"));
        },
        function fail() {
            test.assertExists(x("//a[normalize-space(text())='Export CSV']"));
    });

    casper.run(function() {test.done();});
});
