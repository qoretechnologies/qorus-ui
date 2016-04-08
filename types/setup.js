const jsf = require('json-schema-faker');


jsf.format('qorus-name', gen => (
  gen.randexp('^[a-z][-a-z0-9]{0,31}$')
));

jsf.format('qorus-codename', gen => (
  gen.randexp('^[A-Z][-A-Z0-9]{0,31}$')
));

jsf.format('qorus-version', gen => (
  gen.randexp('^[1-9]\\.\\d{1,2}$')
));

jsf.format('qorus-system-version', gen => (
  gen.randexp('^[1-9]\\.\\d{1,2}\\.\\d{1,2}$')
));

jsf.format('qorus-system-schema', gen => (
  gen.randexp('^[a-z][-a-z0-9]{0,31}@[a-z][_a-z0-9]{0,31}$')
));
