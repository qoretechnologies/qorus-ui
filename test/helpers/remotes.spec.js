import { expect } from 'chai';

import { buildRemoteHash } from '../../src/js/helpers/remotes';

describe('buildRemoteHash from helpers/remotes', () => {
  it('builds new user hash', () => {
    const data = {
      name: 'Filip',
      desc: 'This is Filip',
      url: 'http://filip.com',
      opts: '{"top": "kek"}',
    };

    const hash = buildRemoteHash('user', data);

    expect(hash).to.be.an('object');
    expect(Object.keys(hash)).to.have.length(7);
    expect(hash.name).to.eql('Filip');
    expect(hash.desc).to.eql('This is Filip');
    expect(hash.url).to.eql('http://filip.com');
    expect(hash.opts).to.eql('{"top": "kek"}');
  });

  it('builds new user hash using "options" key', () => {
    const data = {
      name: 'Filip',
      desc: 'This is Filip',
      url: 'http://filip.com',
      options: '{"top": "kek"}',
    };

    const hash = buildRemoteHash('user', data);

    expect(hash).to.be.an('object');
    expect(Object.keys(hash)).to.have.length(8);
    expect(hash.name).to.eql('Filip');
    expect(hash.desc).to.eql('This is Filip');
    expect(hash.url).to.eql('http://filip.com');
    expect(hash.opts).to.eql('{"top": "kek"}');
  });

  it('modifies existing user', () => {
    const data = {
      name: 'Filip',
      desc: 'This is Filip',
      url: 'http://filip.com',
      opts: '{"top": "kek"}',
    };

    const hash = buildRemoteHash('user', data, 'Filip');

    expect(hash).to.be.an('object');
    expect(Object.keys(hash)).to.have.length(4);
    expect(hash.name).to.eql('Filip');
    expect(hash.desc).to.eql('This is Filip');
    expect(hash.url).to.eql('http://filip.com');
    expect(hash.opts).to.eql('{"top": "kek"}');
  });

  it('modifies existing user using "options" key', () => {
    const data = {
      name: 'Filip',
      desc: 'This is Filip',
      url: 'http://filip.com',
      options: '{"top": "kek"}',
    };

    const hash = buildRemoteHash('user', data, 'Filip');

    expect(hash).to.be.an('object');
    expect(Object.keys(hash)).to.have.length(5);
    expect(hash.name).to.eql('Filip');
    expect(hash.desc).to.eql('This is Filip');
    expect(hash.url).to.eql('http://filip.com');
    expect(hash.opts).to.eql('{"top": "kek"}');
  });

  it('builds new datasource hash', () => {
    const data = {
      name: 'Datasource',
      type: 'This is datasource',
      user: 'someuser',
      pass: 'somepass',
      db: 'somedb',
      charset: 'somecharset',
      host: 'somehost',
      port: 'someport',
      options: '{"top": "kek"}',
    };

    const hash = buildRemoteHash('datasources', data);

    expect(hash).to.be.an('object');
    expect(Object.keys(hash)).to.have.length(13);
    expect(hash.name).to.eql('Datasource');
    expect(hash.type).to.eql('This is datasource');
    expect(hash.user).to.eql('someuser');
    expect(hash.pass).to.eql('somepass');
    expect(hash.db).to.eql('somedb');
    expect(hash.charset).to.eql('somecharset');
    expect(hash.host).to.eql('somehost');
    expect(hash.port).to.eql('someport');
    expect(hash.options).to.eql('{"top": "kek"}');
    expect(hash.desc).to.eql(
      'This is datasource:someuser@somedb(somecharset)%somehost:someport{\\top\\= \\kek\\}'
    );
  });

  it('builds new datasource hash without non-required values', () => {
    const data = {
      name: 'Datasource',
      type: 'This is datasource',
      user: 'someuser',
      pass: 'somepass',
      db: 'somedb',
      options: '{"top": "kek"}',
    };

    const hash = buildRemoteHash('datasources', data);

    expect(hash).to.be.an('object');
    expect(Object.keys(hash)).to.have.length(10);
    expect(hash.name).to.eql('Datasource');
    expect(hash.type).to.eql('This is datasource');
    expect(hash.user).to.eql('someuser');
    expect(hash.pass).to.eql('somepass');
    expect(hash.db).to.eql('somedb');
    expect(hash.options).to.eql('{"top": "kek"}');
    expect(hash.desc).to.eql(
      'This is datasource:someuser@somedb{\\top\\= \\kek\\}'
    );
  });

  it('builds new datasource hash without options', () => {
    const data = {
      name: 'Datasource',
      type: 'This is datasource',
      user: 'someuser',
      pass: 'somepass',
      db: 'somedb',
    };

    const hash = buildRemoteHash('datasources', data);

    expect(hash).to.be.an('object');
    expect(Object.keys(hash)).to.have.length(10);
    expect(hash.name).to.eql('Datasource');
    expect(hash.type).to.eql('This is datasource');
    expect(hash.user).to.eql('someuser');
    expect(hash.pass).to.eql('somepass');
    expect(hash.db).to.eql('somedb');
    expect(hash.desc).to.eql(
      'This is datasource:someuser@somedb{max=0,min=0}'
    );
  });

  it('modifies existing datasource', () => {
    const data = {
      name: 'Datasource',
      type: 'This is datasource',
      user: 'someuser',
      pass: 'somepass',
      db: 'somedb',
      options: '{"top": "kekovy"}',
    };

    const hash = buildRemoteHash('datasources', data, 'Datasource');

    expect(hash).to.be.an('object');
    expect(Object.keys(hash)).to.have.length(7);
    expect(hash.name).to.eql('Datasource');
    expect(hash.type).to.eql('This is datasource');
    expect(hash.user).to.eql('someuser');
    expect(hash.pass).to.eql('somepass');
    expect(hash.db).to.eql('somedb');
    expect(hash.options).to.eql('{"top": "kekovy"}');
    expect(hash.desc).to.eql(
      'This is datasource:someuser@somedb{\\top\\= \\kekovy\\}'
    );
  });
});
