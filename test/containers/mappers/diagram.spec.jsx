import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Diagram from '../../../src/js/containers/mappers/diagram';

chai.use(spies);

describe('default', () => {
  const mapper = {
    mapperid: 'test',
    opts: {
      datasource: 'gsi_staging',
      table: 'h3g_it_rev_credit_cc',
      input: {
        SERIAL_NUMBER: {
          desc: '',
        },
        SYS_REF: {
          desc: '',
        },
        LAST_UPDATE_DATE: {
          desc: '',
        },
      },
      output: {
        imei: {
          type: 'string',
          mandatory: true,
          desc: 'Hello',
        },
        delivery_detail_id: {},
        change_date: {},
        status: {},
        previous_status: {},
        i_sepl_status: {},
      },
      name: 'it-31-rma_receipt-rev_credit_cc-dhl-in',
    },
    field_source: {
      imei: '(\"name\": \"SERIAL_NUMBER\"\n)',
      delivery_detail_id: '(\"name\": \"SYS_REF\"\n)',
      change_date: '(\"name\": \"LAST_UPDATE_DATE\"\n)',
      status: '(\"constant\" : \"N\")',
      previous_status: '(\"constant\" : \"I\")',
      i_sepl_status: '(\"constant\" : \"C\")',
    },
  };

  it('Default params', () => {
    const wrapper = mount(
      <Diagram mapper={mapper} />
    );

    expect(wrapper.find('rect')).to.have.length(9);
    expect(wrapper.find('line')).to.have.length(3);
    expect(wrapper.find('polygon')).to.have.length(6);
  });

  it('Mouseout on input field', () => {
    const wrapper = mount(
      <Diagram mapper={mapper} />
    );

    const textNode = wrapper.find('text[children="SERIAL_NUMBER"]');
    textNode.simulate('mouseover');
    textNode.simulate('mouseout');

    expect(wrapper.find('rect[fill="#729C1C"]')).to.have.length(0);
  });

  it('Mouseout on output field', () => {
    const wrapper = mount(
      <Diagram mapper={mapper} />
    );

    const textNode = wrapper.find('text[children="change_date"]');
    textNode.simulate('mouseover');
    textNode.simulate('mouseout');

    expect(wrapper.find('rect[fill="#729C1C"]')).to.have.length(0);
  });

  it('Mouseout on output field shows tooltip', () => {
    const wrapper = mount(
      <Diagram mapper={mapper} />
    );

    const textNode = wrapper.find('text[children="imei"]');
    textNode.simulate('mouseover');

    expect(wrapper.find('.svg-tooltip')).to.have.length(1);
  });

  it('sorts the wrapper by putting non-connected fields last', () => {
    const wrapper = mount(
      <Diagram mapper={mapper} />
    );

    expect(
      wrapper.find('withState(withProps(Diagramm))')
        .props()
        .outputMap
        .find(obj => obj.name === 'change_date')
        .position
    ).to.not.eql(null);
    expect(
      wrapper.find('withState(withProps(Diagramm))')
        .props()
        .outputMap
        .find(obj => obj.name === 'i_sepl_status')
        .position
    ).to.eql(null);
    expect(
      wrapper.find('withState(withProps(Diagramm))')
        .props()
        .outputMap
        .find(obj => obj.name === 'status')
        .position
    ).to.eql(null);
    expect(
      wrapper.find('withState(withProps(Diagramm))')
        .props()
        .outputMap
        .find(obj => obj.name === 'previous_status')
        .position
    ).to.eql(null);
  });
});
