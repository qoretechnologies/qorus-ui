/* eslint no-unused-expressions: 0 */
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';

import {
  sendAuthCredentials,
} from '../../../../../src/js/store/api/resources/auth/actions';

import mochaAsync from '../../../../mocha-async';

chai.use(dirtyChai);

describe('store/api/resources/auth/actions', () => {
  describe('sendAuthCredentials', () => {
    it('send success', mochaAsync(async () => {
      const result = await sendAuthCredentials('admin', 'test')();
      expect(result.token).to.equal('sometkn123');
    }));

    it('send failed', mochaAsync(async () => {
      try {
        await sendAuthCredentials('fake', 'admin')();
      } catch (e) {
        expect(e.error).to.equal('some');
      }
    }));
  });
});
