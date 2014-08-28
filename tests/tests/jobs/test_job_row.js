/*global casper require */

var xpath = require('casper').selectXPath;

casper.test.begin('Testing Job row', function suite(test) {
  casper.start(casper.options.BASE_URL + '/jobs');

  // wait for rendering and then test and click
  casper.waitForSelector('#job-list .table-row', function success() {
    test.assertExists(xpath('//tr[td/a[text()="test"]]'), 'test exists');
    this.click(xpath('//tr[td/a[text()="test"]]/td[@class="controls"]/div/button[@data-toggle="dropdown"]'));
  });
  
  // test open model with job reschedule
  casper.waitForSelector(xpath('//tr[td/a[text()="test"]]/td[@class="controls"]/div[contains(@class,"open")]'), function () {
    test.assertExists(xpath('//tr[td/a[text()="test"]]/td[@class="controls"]/div/ul/li[a[@data-action="schedule"]]'));
    this.click(xpath('//tr[td/a[text()="test"]]/td[@class="controls"]/div/ul/li/a[@data-action="schedule"]'));
  });

  // wait until modal opened
  casper.waitUntilVisible('#modalHeader', function () {
    test.assertExists(xpath('//*[contains(text(), "Reschedule test")]'));

    // close modal
		test.assertExists('#jobs-modal *[data-dismiss]');
    this.click('#jobs-modal *[data-dismiss]');
	});
  
  casper.waitWhileVisible('.modal-backdrop', function () {
    this.click(xpath('//tr[td/a[text()="test"]]/td[@class="controls"]/div/button[@data-toggle="dropdown"]'));
  });
  
  // test open modal with job setting job expiration
  casper.waitUntilVisible(xpath('//tr[td/a[text()="test"]]/td[@class="controls"]/div[contains(@class,"open")]'), function () {
    test.assertExists(xpath('//tr[td/a[text()="test"]]/td[@class="controls"]/div/ul/li[a[@data-action="set-expiry"]]'));
		this.click('div.open ul.dropdown-menu a[data-action=set-expiry]');
	});
	
  // wait until modal opened
  casper.waitUntilVisible('#modalHeader', function () {
    test.assertExists(xpath('//*[contains(text(), "Set expiration test")]'));
    
    // close modal
    this.click('#jobs-modal *[data-dismiss]');
		this.echo('visible');
	});
  
  casper.waitWhileVisible('.modal-backdrop', function () {
		this.echo('invisible');
	});
  	
  casper.run(function() {
     test.done();
  });
});