/* eslint no-unused-expressions: 0 */
/* eslint max-len: 0 */
import { expect } from 'chai';

import isSupported from '../../src/js/helpers/is_supported';

describe('isSupported from \'helpers/is_supported\'', () => {
  it('Browser does not supported', () => {
    expect(
      isSupported('Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Trident/5.0)')
    ).to.be.false;
  });

  it('Browser supported', () => {
    expect(
      isSupported('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36')
    ).to.be.true;
  });
});
