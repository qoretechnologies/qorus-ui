// @flow
import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import selectable from '../../src/js/hocomponents/selectable';

describe('selectable from hocomponents/selectable', () => {
  const Comp: Function = (): React.Element<any> => (
    <div></div>
  );

  it('adds default props to the component', () => {
    const Enhanced = selectable('test')(Comp);
    const wrapper = mount(<Enhanced test={[{ id: 1 }, { id: 2 }]} />);

    expect(wrapper.find(Comp).first().props().selected).to.eql('none');
    expect(wrapper.find(Comp).first().props().selectedIds).to.have.length(0);
  });

  it('adds some selected and ids', () => {
    const Enhanced = selectable('test')(Comp);
    const wrapper = mount(<Enhanced test={[{ id: 1, _selected: true }, { id: 2 }]} />);

    expect(wrapper.find(Comp).first().props().selected).to.eql('some');
    expect(wrapper.find(Comp).first().props().selectedIds).to.have.length(1);
    expect(wrapper.find(Comp).first().props().selectedIds[0]).to.eql(1);
  });

  it('adds all selected and ids', () => {
    const Enhanced = selectable('test')(Comp);
    const wrapper = mount(
      <Enhanced
        test={[{ id: 1, _selected: true }, { id: 2, _selected: true }]}
      />
    );

    expect(wrapper.find(Comp).first().props().selected).to.eql('all');
    expect(wrapper.find(Comp).first().props().selectedIds).to.have.length(2);
    expect(wrapper.find(Comp).first().props().selectedIds[0]).to.eql(1);
    expect(wrapper.find(Comp).first().props().selectedIds[1]).to.eql(2);
  });
});
