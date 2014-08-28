casper.options.BASE_URL = casper.cli.options.url || 'http://admin:admin@localhost:8080';
casper.echo('Starting test with URL: ' + casper.options.BASE_URL);
casper.test.done();
