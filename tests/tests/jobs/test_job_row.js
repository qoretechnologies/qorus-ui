/*global casper require */

var xpath = require('casper').selectXPath;

casper.test.begin('Testing Job row', function suite(test) {
  casper.start(casper.options.BASE_URL + '/jobs');

  // wait for rendering and then test and click
  casper.waitForSelector('#job-list .table-row', function success() {
    test.assertExists(xpath('//tr[td/a[text()="qorus-snapshot-refresh"]]'), 'qorus-snapshot-refresh exists');
    this.click(xpath('//tr[td/a[text()="qorus-snapshot-refresh"]]/td[@class="controls"]/div/button[@data-toggle="dropdown"]'));
  });
  
  // test open model with job reschedule
  casper.waitForSelector(xpath('//tr[td/a[text()="qorus-snapshot-refresh"]]/td[@class="controls"]/div[contains(@class,"open")]'), function () {
    test.assertExists(xpath('//tr[td/a[text()="qorus-snapshot-refresh"]]/td[@class="controls"]/div/ul/li[a[@data-action="schedule"]]'));
    this.click(xpath('//tr[td/a[text()="qorus-snapshot-refresh"]]/td[@class="controls"]/div/ul/li/a[@data-action="schedule"]'));
  });

  // wait until modal opened
  casper.waitUntilVisible('#modalHeader', function () {
    test.assertExists(xpath('//*[contains(text(), "Reschedule qorus-snapshot-refresh")]'));
    
    // close modal
    this.click('#jobs-modal *[data-dismiss]');
  });
  
  casper.waitWhileVisible('#modalHeader', function () {
    this.click(xpath('//tr[td/a[text()="qorus-snapshot-refresh"]]/td[@class="controls"]/div/button[@data-toggle="dropdown"]'));
  });
  
  // test open modal with job setting job expiration
  casper.waitForSelector(xpath('//tr[td/a[text()="qorus-snapshot-refresh"]]/td[@class="controls"]/div[contains(@class,"open")]'), function () {
    test.assertExists(xpath('//tr[td/a[text()="qorus-snapshot-refresh"]]/td[@class="controls"]/div/ul/li[a[@data-action="set-expiry"]]'));
    this.click(xpath('//tr[td/a[text()="qorus-snapshot-refresh"]]/td[@class="controls"]/div/ul/li/a[@data-action="set-expiry"]'));
  });

  // wait until modal opened
  casper.waitUntilVisible('#modalHeader', function () {
    test.assertExists(xpath('//*[contains(text(), "Set expiration qorus-snapshot-refresh")]'));
    
    // close modal
    this.click('#jobs-modal *[data-dismiss]');
  });
  
  casper.waitWhileVisible('#modalHeader');
  
  casper.run(function() {
     test.done();
  });
});