import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import SourceCode from '../../src/js/components/source_code';


describe("SourceCode from 'components/source_code'", () => {
  it('displays formatted source code', () => {
    const comp = TestUtils.renderIntoDocument(
      <SourceCode>
        {'sub test() {}'}
      </SourceCode>
    );

    const code = TestUtils.findRenderedDOMComponentWithTag(comp, 'code');

    expect(code.textContent).to.equal('sub test() {}');
    expect(Array.from(code.classList)).to.include('language-qore');

    const line = code.querySelector('.line');
    expect(line.querySelector('.token.keyword').textContent).to.equal('sub');
    expect(line.querySelector('.token.function').textContent).to.equal('test');
    expect(
      Array.from(line.querySelectorAll('.token.punctuation')).
        map(p => p.textContent)
    ).to.eql(['(', ')', '{', '}']);
  });


  it('shows line numbers', () => {
    const comp = TestUtils.renderIntoDocument(
      <SourceCode>
        {'sub test() {}'}
      </SourceCode>
    );

    const code = TestUtils.findRenderedDOMComponentWithTag(comp, 'code');

    expect(code.firstElementChild.tagName).to.equal('OL');
    expect(code.firstElementChild.children).to.have.length(1);
    expect(
      Array.from(code.firstElementChild.children[0].firstElementChild.classList)
    ).to.include('line');
  });


  it('can offset line numbers', () => {
    const comp = TestUtils.renderIntoDocument(
      <SourceCode lineOffset={5}>
        {'sub test() {}'}
      </SourceCode>
    );

    const code = TestUtils.findRenderedDOMComponentWithTag(comp, 'code');

    expect(code.parentElement.style.counterReset).to.equal('linenumber 5');
  });


  it('wraps lines by default', () => {
    const comp = TestUtils.renderIntoDocument(
      <SourceCode />
    );

    const el = TestUtils.findRenderedDOMComponentWithClass(
      comp, 'source-code__code'
    );

    expect(Array.from(el.classList)).to.include('source-code__code--wrap');
  });


  it('toggles line wrap by clicking on toggle button', () => {
    const comp = TestUtils.renderIntoDocument(
      <SourceCode />
    );

    const btn = TestUtils.findRenderedDOMComponentWithClass(
      comp, 'source-code__wrap-toggle'
    );

    TestUtils.Simulate.click(btn);

    const el = TestUtils.findRenderedDOMComponentWithClass(
      comp, 'source-code__code'
    );

    expect(Array.from(el.classList)).to.not.include('source-code__code--wrap');
  });
});
