import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Date from '../../src/js/components/date';


describe("Date from 'components/date'", () => {
  before(() => {
    chai.use(spies);
  });

  describe('Date', () => {
    it('renders empty span if no props specified', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Date />
      );
      const result = renderer.getRenderOutput();
      expect(result.props.children).to.equal(undefined);
    });
  });

  describe('Date', () => {
    it('renders date with default format YYYY-MM-DD HH:mm:ss', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Date date="2015-01-09 21:05:49.213944 +01:00" />
      );
      const result = renderer.getRenderOutput();

      expect(result.props.children).to.equal('2015-01-09 21:05:49');
    });
  });

  describe('Date', () => {
    it('renders formatted date based on props format', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Date date="2015-01-09 21:05:49.213944 +01:00" format="YYYY-MM-DD" />
      );

      const result = renderer.getRenderOutput();

      expect(result.props.children).to.equal('2015-01-09');
    });
  });
});
