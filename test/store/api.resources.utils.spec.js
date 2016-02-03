import { expect } from 'chai';


import { normalizeName, normalizeId, extendDefaults }
  from '../../src/js/store/api/resources/utils';


describe(
  '{ ' +
    'normalizeName, ' +
    'normalizeId, ' +
    'extendDefaults ' +
  "} from 'store/api/resources/utils'",
() => {
  describe('normalizeId', () => {
    it('creates `id` from some other field recognized as unique identified',
    () => {
      const item = {
        workflowid: 1,
        name: 'EXAMPLE',
        version: '1.0'
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
        version: '1.0'
      };

      const extendedItem = extendDefaults({
        tags: []
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
        version: '1.0'
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
        patch: 4
      };

      const normalizedItem = normalizeName(item);

      expect(normalizedItem.normalizedName).to.equal('EXAMPLE v1.0.4 (1)');
    });
  });
});
