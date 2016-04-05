import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';


import {
  normalizeName, normalizeId, extendDefaults, checkAlerts,
} from '../../src/js/store/api/resources/utils';


chai.use(dirtyChai);

describe(
  '{ ' +
    'normalizeName, ' +
    'normalizeId, ' +
    'extendDefaults ' +
    'checkAlerts' +
  "} from 'store/api/resources/utils'",
() => {
  describe('normalizeId', () => {
    it('creates `id` from some other field recognized as unique identified',
    () => {
      const item = {
        workflowid: 1,
        name: 'EXAMPLE',
        version: '1.0',
      };

      const normalizedItem = normalizeId('workflowid', item);

      expect(normalizedItem.id).to.equal(1);
      delete normalizedItem.id;
      expect(normalizedItem).to.not.equal(item);
      expect(normalizedItem).to.deep.equal(item);
    });
  });


  describe('extendDefaults', () => {
    it('creates new members on new copy of given object', () => {
      const item = {
        workflowid: 1,
        name: 'EXAMPLE',
        version: '1.0',
      };

      const extendedItem = extendDefaults({
        tags: [],
      }, item);

      expect(extendedItem.tags).to.be.an('array');
      expect(extendedItem.tags.length).to.equal(0);
      delete extendedItem.tags;
      expect(extendedItem).to.not.equal(item);
      expect(extendedItem).to.deep.equal(item);
    });
  });


  describe('normalizeName', () => {
    it('creates name with version and ID for an item retrieved via API', () => {
      const item = {
        id: 1,
        name: 'EXAMPLE',
        version: '1.0',
      };

      const normalizedItem = normalizeName(item);

      expect(normalizedItem.normalizedName).to.equal('EXAMPLE v1.0 (1)');
      delete normalizedItem.normalizedName;
      expect(normalizedItem).to.not.equal(item);
      expect(normalizedItem).to.deep.equal(item);
    });


    it('adds patch if available', () => {
      const item = {
        id: 1,
        name: 'EXAMPLE',
        version: '1.0',
        patch: 4,
      };

      const normalizedItem = normalizeName(item);

      expect(normalizedItem.normalizedName).to.equal('EXAMPLE v1.0.4 (1)');
    });
  });

  describe('checkAlerts', () => {
    it('creates has_alerts with true value',
    () => {
      const item = {
        workflowid: 1,
        name: 'EXAMPLE',
        version: '1.0',
        alerts: [{ name: 'alert' }],
      };

      const itemWithAlerts = checkAlerts(item);

      expect(itemWithAlerts.has_alerts).to.be.true();
      delete itemWithAlerts.has_alerts;
      expect(itemWithAlerts).to.not.equal(item);
      expect(itemWithAlerts).to.deep.equal(item);
    });

    it('creates has_alerts with false value',
    () => {
      const item = {
        workflowid: 1,
        name: 'EXAMPLE',
        version: '1.0',
        alerts: [],
      };

      const itemWithAlerts = checkAlerts(item);

      expect(itemWithAlerts.has_alerts).to.be.false();
      delete itemWithAlerts.has_alerts;
      expect(itemWithAlerts).to.not.equal(item);
      expect(itemWithAlerts).to.deep.equal(item);
    });
  });
});
