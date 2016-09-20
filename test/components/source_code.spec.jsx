import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';


import SourceCode from '../../src/js/components/source_code';


describe("SourceCode from 'components/source_code'", () => {
  it('displays formatted source code', () => {
    const wrapper = mount(
      <SourceCode>
        {'sub test() {}'}
      </SourceCode>
    );
    const codeNode = wrapper.find('code').node;
    expect(codeNode.textContent).to.equal('sub test() {}');
    expect(Array.from(codeNode.classList)).to.include('language-qore');

    expect(codeNode.querySelector('.token.keyword').textContent).to.equal('sub');
    expect(codeNode.querySelector('.token.function').textContent).to.equal('test');
    expect(
      Array.from(codeNode.querySelectorAll('.token.punctuation')).
        map(p => p.textContent)
    ).to.eql(['(', ')', '{', '}']);
  });


  it('does not wrap lines and show line numbers by default', () => {
    const wrapper = mount(
      <SourceCode>
        {'sub test() {}'}
      </SourceCode>
    );

    expect(wrapper.find('.source-code__code--wrap')).to.have.length(0);
    expect(wrapper.find('.line-numbers')).to.have.length(1);
  });


  it('toggles line wrap by clicking on toggle button', () => {
    const wrapper = mount(
      <SourceCode>
        {'sub test() {}'}
      </SourceCode>
    );

    wrapper.find('.source-code__wrap-toggle').simulate('click');

    expect(wrapper.find('.source-code__code--wrap')).to.have.length(1);
    expect(wrapper.find('.line-numbers')).to.have.length(0);
  });
});
