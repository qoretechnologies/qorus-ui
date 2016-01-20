import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import CollectionSearch from '../../src/js/components/collectionSearch';


describe("CollectionSearch from 'components/collectionSearch'", () => {
  it('renders input search field and submit button', () => {
    const comp = TestUtils.renderIntoDocument(
      <CollectionSearch />
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(comp, 'input');
    const button = TestUtils.findRenderedDOMComponentWithTag(comp, 'button');

    expect(input.type).to.equal('search');
    expect(Array.from(input.classList)).to.contain('form-search__field');
    expect(button.type).to.equal('submit');
    expect(Array.from(button.classList)).to.contain('form-search__btn');
    expect(Array.from(button.firstElementChild.classList)).
      to.contain('fa');
    expect(Array.from(button.firstElementChild.classList)).
      to.contain('fa-search');
  });


  it('calls onChange prop callback with new RegExp filter on input change',
  () => {
    let result;
    const comp = TestUtils.renderIntoDocument(
      <CollectionSearch onChange={filter => result = filter} />
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(comp, 'input');
    input.value = 'filter';
    TestUtils.Simulate.change(input);

    expect(result.toString()).to.equal('/filter/g');
  });


  it('escapes special RegExp characters', () => {
    let result;
    const comp = TestUtils.renderIntoDocument(
      <CollectionSearch onChange={filter => result = filter} />
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(comp, 'input');
    input.value = '^.*([a-z]){2}(a|z)?\\.+$';
    TestUtils.Simulate.change(input);

    // Every \ must be escaped in string literal.
    expect(result.toString()).
      to.equal('/\\^\\.\\*\\(\\[a-z\\]\\)\\{2\\}\\(a\\|z\\)\\?\\\\\\.\\+\\$/g');
  });


  it('optionally creates a RegExp filter with ignore-case flag', () => {
    let result;
    const comp = TestUtils.renderIntoDocument(
      <CollectionSearch onChange={filter => result = filter} ignoreCase />
    );

    const input = TestUtils.findRenderedDOMComponentWithTag(comp, 'input');

    input.value = 'FiLTER';
    TestUtils.Simulate.change(input);

    expect(result.toString()).to.equal('/FiLTER/gi');
  });


  it('optionally renders RE switch to treat input as RegExp', () => {
    let result;
    const comp = TestUtils.renderIntoDocument(
      <CollectionSearch onChange={filter => result = filter} regexp />
    );

    const [re, input] =
      TestUtils.scryRenderedDOMComponentsWithTag(comp, 'input');

    re.checked = true;
    TestUtils.Simulate.change(re);

    input.value = '\w+';
    TestUtils.Simulate.change(input);

    expect(Array.from(re.parentElement.classList)).
      to.contain('form-search__mod');

    expect(result.toString()).to.equal('/\w+/g');
  });


  it('optionally renders new form group with children', () => {
    const comp = TestUtils.renderIntoDocument(
      <CollectionSearch>
        <button type='button'>Action Button</button>
      </CollectionSearch>
    );

    const groups =
      TestUtils.scryRenderedDOMComponentsWithClass(comp, 'form-group');

    expect(groups).to.have.length(2);
    expect(groups[1].firstElementChild.textContent).to.equal('Action Button');
  });
});
