/*global casper require */

var x = require('casper').selectXPath;

casper.test.begin('Testing workflow list page', function suite(test) {
  casper.on('remote.message', function(message) {
    this.echo(message);
  });

   casper.start(casper.options.BASE_URL + '/workflows');

   casper.waitForSelector("#workflows-toolbar > .toolbar > .filters",
       function success() {
           test.assertExists("#workflows-toolbar > .toolbar > .filters > button");
           this.click("#workflows-toolbar > .toolbar > .filters > button");
       },
       function fail() {
           this.capture('test.error.png');
           test.assertExists("#workflows-toolbar > .toolbar > .filters > button");
    }, 20000);

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
