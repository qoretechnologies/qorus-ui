import { expect } from 'chai';
import { flowRight, clone, first } from 'lodash';
import { normalizeName, normalizeId, extendDefaults }
  from '../../src/js/store/api/resources/utils.js';

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

describe('Testing API resources utils', () => {
  const objWithNormalizedId = objList.map(
    flowRight(normalizeId('normalizeMeId'), clone)
  );
  const objWithExtendedDefaults = objList.map(extendDefaults(defaults));
  const objWithNormalizedName = objList.map(flowRight(
    normalizeName,
    normalizeId('normalizeMeId'),
    clone
  ));

  it('objWithNormalized.normalizedName should be \'gold v1 (1)\'', () => {
    expect(first(objWithNormalizedName).normalizedName).to.equal('gold v1 (1)');
  });

  it('objWithNormalizedId.id should be \'1\'', () => {
    expect(first(objWithNormalizedId).id).to.equal(1);
  });

  it('objWithExtendedDefaults should have property \'defaultKey\'', () => {
    expect(first(objWithExtendedDefaults)).to.have.property('defaultKey');
  });
});
