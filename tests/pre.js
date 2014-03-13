casper.options.BASE_URL = casper.cli.options.url || 'http://localhost:8080';
casper.echo('Starting test with URL: ' + casper.options.BASE_URL);
casper.test.done();
