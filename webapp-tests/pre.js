casper.options.BASE_URL = casper.cli.options.url || 'http://localhost:8001';
casper.echo('Starting test with URL: ' + casper.options.BASE_URL);
casper.test.done();
