import { expect } from 'chai';

import { selectedType } from '../../src/js/helpers/resources';

describe('selectedType from helpers/resources', () => {
  it('returns none', () => {
    const collection = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];

    expect(selectedType(collection)).to.eql('none');
  });

  it('returns some', () => {
    const collection = [
      {
        id: 1,
        _selected: true,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ];

    expect(selectedType(collection)).to.eql('some');
  });

  it('returns all', () => {
    const collection = [
      {
        id: 1,
        _selected: true,
      },
      {
        id: 2,
        _selected: true,
      },
      {
        id: 3,
        _selected: true,
      },
    ];

    expect(selectedType(collection)).to.eql('all');
  });
});
