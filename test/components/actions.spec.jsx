import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { Actions } from '../../src/js/components/toolbar';
import { Control as Button } from '../../src/js/components/controls';

describe("{ Actions } from 'components/toolbar'", () => {
  before(() => {
    chai.use(spies);
  });

  it('renders actions with a button', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Actions>
        <Button
          label="Enable"
          icon="icon"
        />
      </Actions>
    );
    const result = renderer.getRenderOutput();

    expect(result.type).to.equal('div');
    expect(result.props.children.type).to.equal(Button);
  });
});
