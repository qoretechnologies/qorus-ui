import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import InfoTable from '../../src/js/components/info_table';


describe("InfoTable from 'components/info_table'", () => {
  it('displays table with capitalized name and value column for each object ' +
     'property',
  () => {
    const comp = TestUtils.renderIntoDocument(
      <InfoTable object={{ name: 'value' }} />
    );

    const table = TestUtils.findRenderedDOMComponentWithTag(comp, 'table');

    expect(table.tBodies[0].rows).to.have.length(1);
    expect(table.tBodies[0].rows[0].cells).to.have.length(2);
    expect(table.tBodies[0].rows[0].cells[0].textContent).to.equal('Name');
    expect(table.tBodies[0].rows[0].cells[1].textContent).to.equal('value');
  });


  it('can omit specified object properties', () => {
    const comp = TestUtils.renderIntoDocument(
      <InfoTable
        object={{ toOmit: 'no display', name: 'value' }}
        omit={['toOmit']}
      />
    );

    const table = TestUtils.findRenderedDOMComponentWithTag(comp, 'table');

    expect(table.tBodies[0].rows).to.have.length(1);
    expect(table.tBodies[0].rows[0].cells).to.have.length(2);
    expect(table.tBodies[0].rows[0].cells[0].textContent).to.equal('Name');
    expect(table.tBodies[0].rows[0].cells[1].textContent).to.equal('value');
  });


  it('can pick specified object properties', () => {
    const comp = TestUtils.renderIntoDocument(
      <InfoTable
        object={{ toPick: 'display this', name: 'value' }}
        pick={['toPick']}
      />
    );

    const table = TestUtils.findRenderedDOMComponentWithTag(comp, 'table');

    expect(table.tBodies[0].rows).to.have.length(1);
    expect(table.tBodies[0].rows[0].cells).to.have.length(2);
    expect(table.tBodies[0].rows[0].cells[0].textContent).to.equal('Topick');
    expect(table.tBodies[0].rows[0].cells[1].textContent).
      to.equal('display this');
  });


  it('complex values are wrapped in `pre` tag', () => {
    const comp = TestUtils.renderIntoDocument(
      <InfoTable object={{ complex: { foo: 'bar' } }} />
    );

    const table = TestUtils.findRenderedDOMComponentWithTag(comp, 'table');

    expect(table.tBodies[0].rows[0].cells[1].firstElementChild.children[0].tagName).
      to.equal('PRE');
    expect(table.tBodies[0].rows[0].cells[1].firstElementChild.textContent).
      to.equal('{\n    "foo": "bar"\n}');
  });
});
