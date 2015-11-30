import '../jsdom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { Control, Controls } from '../../src/js/components/controls';


describe("* as components from 'components/controls'", () => {
  before(() => {
    chai.use(spies);
  });

  describe('{ Control } = components', () => {
    it('renders icon in label', () => {
      const comp = TestUtils.renderIntoDocument(
        <Control icon='refresh' />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'a');

      expect(Array.from(el.classList)).to.include('label');
      expect(Array.from(el.classList)).to.include('label-default');
      expect(Array.from(el.firstChild.classList)).to.include('fa');
      expect(Array.from(el.firstChild.classList)).to.include('fa-refresh');
    });

    it('applies label style', () => {
      const comp = TestUtils.renderIntoDocument(
        <Control icon='refresh' labelStyle='primary' />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'a');

      expect(Array.from(el.classList)).to.include('label-primary');
      expect(Array.from(el.classList)).not.to.include('label-default');
    });

    it('applies title', () => {
      const comp = TestUtils.renderIntoDocument(
        <Control icon='refresh' title='Restart' />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'a');

      expect(el.title).to.equal('Restart');
    });

    it('handles action on click', () => {
      const action = chai.spy();
      const comp = TestUtils.renderIntoDocument(
        <Control icon='refresh' action={action} />
      );

      const el = TestUtils.findRenderedDOMComponentWithTag(comp, 'a');
      TestUtils.Simulate.click(el);

      expect(action).to.have.been.called();
    });
  });

  describe('{ Controls } = components', () => {
    it('conveniently groups Control instances together', () => {
      const comp = TestUtils.renderIntoDocument(
        <Controls>
          <Control icon='power-off' />
          <Control icon='refresh' />
        </Controls>
      );

      const comps = TestUtils.scryRenderedComponentsWithType(comp, Control);

      expect(comps).to.have.length(2);
    });
  });
});
