import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import * as shallow from '../shallow';


import Footer from '../../src/js/components/footer';


describe("Footer from 'components/footer'", () => {
  it('displays schema, version and build if passed', () => {
    const info = {
      'omq-schema': 'test@test',
      'omq-version': '1',
      'omq-build': 'test',
    };

    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Footer info={info} />
    );
    const result = renderer.getRenderOutput();

    const els = shallow.filterTree(result, el => (
      el.type === 'small'
    ));

    expect(els[0].props.children).to.eql('(Schema: test@test)');
    expect(els[1].props.children.join('')).to.eql('(Version: 1.test)');
  });
});
