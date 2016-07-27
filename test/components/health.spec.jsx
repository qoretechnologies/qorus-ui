import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { Health, HealthItem } from '../../src/js/components/health';

describe('{ Health, HealthItem } from components/health', () => {
  it('Show all items with health item layout', () => {
    const wrapper = mount(
      <Health title="test">
        <HealthItem title="key-1">value</HealthItem>
        <HealthItem title="key-2"><strong>Another</strong></HealthItem>
      </Health>
    );

    expect(wrapper.find('h6').text()).to.equals('test');
    expect(wrapper.find('tr').length).to.equals(2);
    expect(wrapper.find('strong').length).to.equals(1);
  });

  it('Do not show not HealthItem child', () => {
    const wrapper = mount(
      <Health title="test">
        <HealthItem title="key-1">value</HealthItem>
        <tr><th>test</th><td>test</td></tr>
      </Health>
    );

    expect(wrapper.find('tr').length).to.equals(1);
  });
});