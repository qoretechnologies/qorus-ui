import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Datepicker from '../../src/js/components/datepicker';

import moment from 'moment';

describe("Datepicker from 'components/datepicker'", () => {
  it('renders the Datepicker input with the provided date and the picker is not shown', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Datepicker date="19880809111213" />
    );
    const result = renderer.getRenderOutput();

    expect(result.type).to.equal('div');
    expect(result.props.children[0].props.inputDate).to.equal('1988-08-09 11:12:13');
    expect(result.props.children[2]).to.equal(null);
  });

  it('renders the Datepicker input with default date', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Datepicker date="24h" />
    );
    const result = renderer.getRenderOutput();
    const date = moment().add(-1, 'days').format('YYYY-MM-DD HH:mm:ss');

    expect(result.props.children[0].props.inputDate).to.equal(date);
  });

  it('renders the Datepicker input with current date', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Datepicker date="now" />
    );
    const result = renderer.getRenderOutput();
    const date = moment().format('YYYY-MM-DD HH:mm:ss');

    expect(result.props.children[0].props.inputDate).to.equal(date);
  });

  it('renders the Datepicker input with the "all" date', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <Datepicker date="all" />
    );
    const result = renderer.getRenderOutput();
    const date = moment('19700101000000').format('YYYY-MM-DD HH:mm:ss');

    expect(result.props.children[0].props.inputDate).to.equal(date);
  });
});
