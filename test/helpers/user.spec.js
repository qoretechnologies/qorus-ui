import { expect } from 'chai';
import { hasPermission } from '../../src/js/helpers/user';

const perms = [
  'TEST',
  'TEST2',
  'ANOTHERTEST',
];

describe('hasPermission from helpers/user', () => {
  it('returns true when asked for single string permission', () => {
    const result = hasPermission(perms, 'ANOTHERTEST');

    expect(result).to.equal(true);
  });

  it('returns false when asked for wrong single string permission', () => {
    const result = hasPermission(perms, 'NONEXISTINGTEST');

    expect(result).to.equal(false);
  });

  it('returns true when asked for array of permissions', () => {
    const result = hasPermission(perms, ['TEST', 'TEST2']);

    expect(result).to.equal(true);
  });

  it('returns false when asked for wrong array of permissions', () => {
    const result = hasPermission(perms, ['TEST', 'SUPERTEST']);

    expect(result).to.equal(false);
  });

  it('returns true when asked for one or other permission', () => {
    const result = hasPermission(perms, ['TEST', 'SUPERTEST'], 'or');

    expect(result).to.equal(true);
  });
});
