import { expect } from 'chai';
import {
  updateProps,
  deleteProps,
} from '../../src/js/store/api/resources/props/helper';

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

describe('{ updateProps, deleteProps } from store/props/actions/helper', () => {
  describe('updateProps', () => {
    it('adds a new prop', () => {
      const props = getProps();
      const result = updateProps(props, { domain: 'omq', key: 'newkey', value: 'prop' });

      expect(result).to.be.an('object');
      expect(Object.keys(result.omq).length).to.equal(3);
      expect(result.omq.newkey).to.equal('prop');
    });

    it('updates a new prop', () => {
      const props = getProps();
      const result = updateProps(props, { domain: 'omq', key: 'test', value: 'updated' });

      expect(result).to.be.an('object');
      expect(Object.keys(result.omq).length).to.equal(2);
      expect(result.omq.test).to.equal('updated');
    });
  });

  describe('deleteProps', () => {
    it('removes a prop', () => {
      const props = getProps();
      const result = deleteProps(props, { domain: 'another' });

      expect(result).to.be.an('object');
      expect(Object.keys(result).length).to.equal(1);
    });

    it('removes a prop key', () => {
      const props = getProps();
      const result = deleteProps(props, { domain: 'another', key: 'super' });

      expect(result).to.be.an('object');
      expect(Object.keys(result).length).to.equal(2);
      expect(Object.keys(result.another).length).to.equal(1);
      expect(result.another.super).to.equal(undefined);
    });
  });
});
