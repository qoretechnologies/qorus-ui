import { expect } from 'chai';
import { getAlertObjectLink, typeToString } from '../../src/js/helpers/system';

describe("{ getAlertObjectLink, typeToString } from 'helpers/search'", () => {
  describe('getAlertObjectLink', () => {
    it('returns a correct url chunk using id', () => {
      const url = getAlertObjectLink('SERVICE', { id: 20, name: 'Irellevant' });

      expect(url).to.eql('/services?paneId=20');
    });

    it('returns a correct url chunk using name', () => {
      const url = getAlertObjectLink('GROUP', { id: 20, name: 'group_name' });

      expect(url).to.eql('/groups?group=group_name');
    });

    it('returns a correct url chunk with suffix', () => {
      const url = getAlertObjectLink('WORKFLOW', { id: 20 });

      expect(url).to.eql('/workflows?paneId=20');
    });
  });

  describe('typeToString', () => {
    it('returns undefined when the arg is not provided', () => {
      const val = typeToString();

      expect(val).to.eql('undefined');
    });

    it('returns null when the arg is null', () => {
      const val = typeToString(null);

      expect(val).to.eql('null');
    });

    it('returns true when the arg is true', () => {
      const val = typeToString(true);

      expect(val).to.eql('true');
    });

    it('returns false when the arg is false', () => {
      const val = typeToString(false);

      expect(val).to.eql('false');
    });

    it('returns whatever has been passed', () => {
      const str = typeToString('test');
      const obj = typeToString({ a: 'b' });
      const arr = typeToString(['kek']);

      expect(str).to.eql('test');
      expect(obj).to.eql({ a: 'b' });
      expect(arr).to.eql(['kek']);
    });
  });
});
