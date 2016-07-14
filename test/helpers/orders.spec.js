import { expect } from 'chai';
import { canSkip } from '../../src/js/helpers/orders';

describe('{ canSkip } from helpers/orders', () => {
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
});
