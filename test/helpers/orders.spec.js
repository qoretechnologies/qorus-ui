import { expect } from 'chai';
import { canSkip, formatCount } from '../../src/js/helpers/orders';

describe('canSkip, formatCount from helpers/orders', () => {
  describe('canSkip', () => {
    it('returns true when the step has type ASYNC has ERROR ' +
      'status and hasnt been skipped yet', () => {
      const step = {
        steptype: 'ASYNC',
        stepstatus: 'ERROR',
        skip: false,
      };

      const result = canSkip(step);

      expect(result).to.equal(true);
    });

    it('returns false when the skip has COMPLETE status and hasnt been skipped yet', () => {
      const step = {
        steptype: 'ASYNC',
        stepstatus: 'COMPLETE',
        skip: false,
      };

      const result = canSkip(step);

      expect(result).to.equal(false);
    });

    it('returns false when the skip has type SUBWORKFLOW, ERROR ' +
      'status and hasnt been skipped yet', () => {
      const step = {
        steptype: 'SUBWORKFLOW',
        stepstatus: 'ERROR',
        skip: false,
      };

      const result = canSkip(step);

      expect(result).to.equal(false);
    });

    it('returns false when the skip has ERROR status but it has been skipped', () => {
      const step = {
        steptype: 'ASYNC',
        stepstatus: 'ERROR',
        skip: true,
      };

      const result = canSkip(step);

      expect(result).to.equal(false);
    });

    it('returns false when the skip has COMPLETE status and it has been skipped', () => {
      const step = {
        steptype: 'SUBWORKFLOW',
        stepstatus: 'COMPLETE',
        skip: true,
      };

      const result = canSkip(step);

      expect(result).to.equal(false);
    });
  });

  describe.only('formatCount', () => {
    it('returns the given number unchanged', () => {
      const num = formatCount(10);

      expect(num).to.eql(10);
    });

    it('returns ceiled number below 100000', () => {
      const num = formatCount(11578);

      expect(num).to.eql('12k');
    });

    it('returns floored number below 100000', () => {
      const num = formatCount(11365);

      expect(num).to.eql('11k');
    });

    it('returns ceiled number above 100000', () => {
      const num = formatCount(149776);

      expect(num).to.eql('150k');
    });

    it('returns floored number above 100000', () => {
      const num = formatCount(173499);

      expect(num).to.eql('173k');
    });
  });
});
