import { expect } from 'chai';
import { findBy } from '../../src/js/helpers/search';

const workflows = [
  {
    name: 'This is a test',
    id: 1,
  },
  {
    name: 'Hello from the other side',
    id: 2,
  },
  {
    name: 'This might be a test too',
    id: 3,
  },
  {
    name: 'Another workflow',
    id: 25,
  },
];

describe("searchCollection from 'helpers/search'", () => {
  it('returns workflows with "test" in name', () => {
    const filteredWorkflows = findBy('name', 'test', workflows);

    expect(filteredWorkflows).to.have.length(2);
    expect(filteredWorkflows[0].id).to.equal(1);
    expect(filteredWorkflows[1].id).to.equal(3);
  });

  it('returns workflows with 2 in id', () => {
    const filteredWorkflows = findBy('id', 2, workflows);

    expect(filteredWorkflows).to.have.length(2);
    expect(filteredWorkflows[0].id).to.equal(2);
    expect(filteredWorkflows[1].id).to.equal(25);
  });

  it('returns workflows with "test" in name and 5 in id', () => {
    const filteredWorkflows = findBy(['name', 'id'], 'test 5', workflows);

    expect(filteredWorkflows).to.have.length(3);
    expect(filteredWorkflows[0].id).to.equal(1);
    expect(filteredWorkflows[1].id).to.equal(3);
    expect(filteredWorkflows[2].id).to.equal(25);
  });

  it('returns workflows with "test" and "hello" in name, case insensitive', () => {
    const filteredWorkflows = findBy('name', 'test hello', workflows);

    expect(filteredWorkflows).to.have.length(3);
    expect(filteredWorkflows[0].id).to.equal(1);
    expect(filteredWorkflows[1].id).to.equal(2);
    expect(filteredWorkflows[2].id).to.equal(3);
  });
});
