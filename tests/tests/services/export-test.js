/*global casper require */

var x = require('casper').selectXPath;

casper.test.begin('Testing workflow list page', function suite(test) {
    casper.start(casper.options.BASE_URL + '/services');

    casper.waitForSelector(x("//a[normalize-space(text())='Export CSV']"),
        function success() {
            test.assertExists(x("//a[normalize-space(text())='Export CSV']"));
            this.click(x("//a[normalize-space(text())='Export CSV']"));
        },
        function fail() {
            test.assertExists(x("//a[normalize-space(text())='Export CSV']"));
    });

    casper.waitForSelector("textarea",
        function success() {
            test.assertExists("textarea");
            this.click("textarea");
        },
        function fail() {
            test.assertExists("textarea");
    });

    casper.waitForSelector(".modal-backdrop.fade.in",
        function success() {
            test.assertExists(".modal-backdrop.fade.in");
            this.click(".modal-backdrop.fade.in");
        },
        function fail() {
            test.assertExists(".modal-backdrop.fade.in");
    });
  
    casper.waitWhileVisible(".modal-backdrop",
        function success() {
            test.assertNotVisible('.modal-backdrop');
        },
        function fail() {
            test.assertExists('.modal-backdrop');
    });
 
    casper.run(function() {test.done();});
});