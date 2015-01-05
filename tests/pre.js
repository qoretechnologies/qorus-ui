casper.options.BASE_URL = casper.cli.options.url || 'http://127.0.0.1:3000';
casper.echo('Starting test with URL: ' + casper.options.BASE_URL);
casper.test.done();