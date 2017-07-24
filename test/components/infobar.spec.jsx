import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { InfoBar, InfoBarItem } from '../../src/js/components/infobar';

describe('InfoBar, InfoBarItem from "components/infobar"', () => {
  it('renders the bar with items correctly', () => {
    const wrapper = mount(
      <InfoBar>
        <InfoBarItem> Item 1 </InfoBarItem>
        <InfoBarItem> Item 2 </InfoBarItem>
        <InfoBarItem> Item 3 </InfoBarItem>
      </InfoBar>
    );

    expect(wrapper.find('.infobar')).to.have.length(1);
    expect(wrapper.find('.infobar-item')).to.have.length(3);
  });

  describe('InfoBarItem', () => {
    it('displays the item with icon and style', () => {
      const wrapper = mount(
        <InfoBarItem icon="warning" style="danger">Danger</InfoBarItem>
      );

      expect(wrapper.find('span').text()).to.eql(' Danger');
      expect(wrapper.find('i').hasClass('fa-warning')).to.eql(true);
      expect(wrapper.find('i').hasClass('text-danger')).to.eql(true);
    });
  });
});
