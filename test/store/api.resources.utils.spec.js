import { expect } from 'chai';
import { compose, clone } from 'lodash';
import { normalizeName, normalizeId, extendDefaults }
  from '../../src/js/store/api/resources/utils.js';

describe('Testing API resources utils', () => {
  const defaults = {
    defaultKey: 'defaultValue'
  };

  const objList = [
    {
      name: 'gold',
      normalizeMeId: 1,
      version: 1,
      patch: undefined
    }
  ];


  const objWithNormalizedId = objList.map(compose(normalizeId('normalizeMeId'), clone))[0];
  const objWithExtendedDefaults = objList.map(extendDefaults(defaults))[0];
  const objWithNormalizedName = objList.map(compose(
    normalizeName,
    normalizeId('normalizeMeId'),
    clone
  ))[0];

  it('objWithNormalized.normalizedName should be \'gold v1 (1)\'', () => {
    expect(objWithNormalizedName.normalizedName).to.equal('gold v1 (1)');
  });

  it('objWithNormalizedId.id should be \'1\'', () => {
    expect(objWithNormalizedId.id).to.equal(1);
  });

  it('objWithExtendedDefaults should have property \'defaultKey\'', () => {
    expect(objWithExtendedDefaults).to.have.property('defaultKey');
  });
});
