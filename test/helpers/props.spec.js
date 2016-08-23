import { expect } from 'chai';
import {
  updateProp,
  delProp as deleteProp,
} from '../../src/js/store/api/resources/system/props/actions/helper';

const getProps = () => ({
  omq: {
    test: 'hello',
    awesome: 'value',
  },
  another: {
    great: 'object',
    super: 'great',
  },
});

describe('{ updateProp, deleteProp } from store/props/actions/helper', () => {
  describe('updateProp', () => {
    it('adds a new prop', () => {
      const props = getProps();
      const result = updateProp(props, { domain: 'omq', key: 'newkey', value: 'prop' });

      expect(result).to.be.an('object');
      expect(Object.keys(result.omq).length).to.equal(3);
      expect(result.omq.newkey).to.equal('prop');
    });

    it('updates a new prop', () => {
      const props = getProps();
      const result = updateProp(props, { domain: 'omq', key: 'test', value: 'updated' });

      expect(result).to.be.an('object');
      expect(Object.keys(result.omq).length).to.equal(2);
      expect(result.omq.test).to.equal('updated');
    });
  });

  describe('deleteProp', () => {
    it('removes a prop', () => {
      const props = getProps();
      const result = deleteProp(props, { domain: 'another' });

      expect(result).to.be.an('object');
      expect(Object.keys(result).length).to.equal(1);
    });

    it('removes a prop key', () => {
      const props = getProps();
      const result = deleteProp(props, { domain: 'another', key: 'super' });

      expect(result).to.be.an('object');
      expect(Object.keys(result).length).to.equal(2);
      expect(Object.keys(result.another).length).to.equal(1);
      expect(result.another.super).to.equal(undefined);
    });
  });
});
