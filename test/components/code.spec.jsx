import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Code from '../../src/js/components/code';

describe('Code from "components/code"', () => {
  const data = {
    firstArray: [
      {
        name: 'Function',
        body: 'const hello=2;',
      },
      {
        type: 'this one has type',
        name: 'Function 2',
        body: 'const hello=4;',
      },
    ],
    secondArray: [
      {
        name: 'Function header',
        functions: [
          {
            name: 'Deep function 1',
            body: 'const deephello=1;',
          },
        ],
      },
    ],
  };

  it.only('renders the component with preselected data', () => {
    const wrapper = mount(
      <Code
        selected={{
          name: 'firstArray - Function',
          code: 'const hello=2;',
        }}
        data={data}
      />
    );

    expect(wrapper.find('lifecycle(Code)').props().selected.name)
      .to.eql('firstArray - Function');
    expect(wrapper.find('lifecycle(Code)').props().selected.code)
      .to.eql('const hello=2;');
    expect(wrapper.find('.code-item').first().props().className)
      .to.eql('code-item selected');
    expect(wrapper.find('code').first().text()).to.eql('const hello=2;');
  });

  it('renders the component with auto height', () => {
    const wrapper = mount(
      <Code data={{}} />
    );

    expect(wrapper.find('lifecycle(Code)').first().props().height).to.eql('auto');
  });

  it('toggles the section when name clicked', () => {
    const wrapper = mount(
      <Code data={data} />
    );

    wrapper.find('.code-section h5').first().simulate('click');

    expect(wrapper.find('.code-section__list')).to.have.length(1);

    wrapper.find('.code-section h5').first().simulate('click');

    expect(wrapper.find('.code-section__list')).to.have.length(2);
  });

  it('renders the component with provided height', () => {
    const wrapper = mount(
      <Code data={{}} heightUpdater={() => 40} />
    );

    expect(wrapper.find('lifecycle(Code)').first().props().height).to.eql(40);
  });

  it('renders the data correctly', () => {
    const wrapper = mount(
      <Code data={data} />
    );

    expect(wrapper.find('.code-item')).to.have.length(3);
    expect(wrapper.find('.code-item-type')).to.have.length(1);
    expect(wrapper.find('.code-item-header')).to.have.length(1);
  });

  it('selects the item on click and renders the code', () => {
    const wrapper = mount(
      <Code data={data} />
    );

    wrapper.find('.code-item').first().simulate('click');

    expect(wrapper.find('lifecycle(Code)').props().selected.name)
      .to.eql('firstArray - Function');
    expect(wrapper.find('lifecycle(Code)').props().selected.code)
      .to.eql('const hello=2;');
    expect(wrapper.find('.code-item').first().props().className)
      .to.eql('code-item selected');
    expect(wrapper.find('code').first().text()).to.eql('const hello=2;');
  });
});
