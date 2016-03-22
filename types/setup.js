const jsf = require('json-schema-faker');


jsf.formats('qorus-name', gen => (
  gen.randexp('^[a-z][-a-z0-9]{0,31}$')
));

jsf.formats('qorus-codename', gen => (
  gen.randexp('^[A-Z][-A-Z0-9]{0,31}$')
));

jsf.formats('qorus-version', gen => (
  gen.randexp('^[1-9]\\.\\d{1,2}$')
));

jsf.formats('qorus-system-version', gen => (
  gen.randexp('^[1-9]\\.\\d{1,2}\\.\\d{1,2}$')
));

jsf.formats('qorus-system-schema', gen => (
  gen.randexp('^[a-z][-a-z0-9]{0,31}@[a-z][_a-z0-9]{0,31}$')
));
