import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';


import Table, { Section, Row, Cell } from '../../src/js/components/table';


describe("Table, { Section, Row, Cell } from 'components/table'", () => {
  const records = [
    { field: 'value' },
  ];


  function* genCells(rec) {
    for (const name of ['field']) {
      yield (
        <Cell key={name}>
          {rec[name]}
        </Cell>
      );
    }
  }


  function* genBodyRows(recs) {
    for (let i = 0; i < recs.length; i += 1) {
      yield (
        <Row key={i} data={recs[i]} cells={genCells} />
      );
    }
  }


  function expectCellStructure(cell) {
    expect(cell.childNodes).to.have.length(1);
    expect(cell.childNodes[0].data).to.equal('value');
  }


  function expectRowStructure(row) {
    expect(row.cells).to.have.length(1);
    expectCellStructure(row.cells[0]);
  }


  function expectTBodyStructure(tBody) {
    expect(tBody.rows).to.have.length(1);
    expectRowStructure(tBody.rows[0]);
  }


  describe('Table', () => {
    it('can render dynamic tabular data from generator yielding other ' +
       'Section elements from `data` prop',
    () => {
      function* genTBodySection(recs) {
        yield (
          <Section key="body" type="body" data={recs} rows={genBodyRows} />
        );
      }

      const comp = TestUtils.renderIntoDocument(
        <Table data={records} sections={genTBodySection} />
      );

      const table = TestUtils.findRenderedDOMComponentWithTag(comp, 'table');

      expect(table.tBodies).to.have.length(1);
      expectTBodyStructure(table.tBodies[0]);
    });


    it('can render data from generator yielding DOM elements without ' +
       '`data` prop',
    () => {
      function* genDomBodyRows() {
        yield (
          <tbody key="dom">
            <tr>
              <td>
                DOM cell
              </td>
            </tr>
          </tbody>
        );
      }

      const comp = TestUtils.renderIntoDocument(
        <Table sections={genDomBodyRows} />
      );

      const table = TestUtils.findRenderedDOMComponentWithTag(comp, 'table');

      expect(table.tBodies).to.have.length(1);
      expect(table.tBodies[0].rows).to.have.length(1);
      expect(table.tBodies[0].rows[0].cells).to.have.length(1);
      expect(table.tBodies[0].rows[0].cells[0].firstChild.data).
        to.equal('DOM cell');
    });


    it('can render elements passed as children', () => {
      const comp = TestUtils.renderIntoDocument(
        <Table>
          <Section type="body" data={records} rows={genBodyRows} />
        </Table>
      );

      const table = TestUtils.findRenderedDOMComponentWithTag(comp, 'table');

      expect(table.tBodies).to.have.length(1);
      expectTBodyStructure(table.tBodies[0]);
    });


    it('passes all props except for `data` or `sections` to actual table ' +
       'element',
    () => {
      const comp = TestUtils.renderIntoDocument(
        <Table className="data" />
      );

      const table = TestUtils.findRenderedDOMComponentWithTag(comp, 'table');

      expect(table.className).to.equal('data');
    });
  });


  describe('Section', () => {
    it('renders different type of table section based on `type` prop',
    () => {
      const table = TestUtils.renderIntoDocument(
        <table>
          <Section type="body" />
        </table>
      );

      expect(table.tBodies).to.have.length(1);
    });


    it('can render rows dynamically from generator yielding Row ' +
       'elements from `data` prop',
    () => {
      const table = TestUtils.renderIntoDocument(
        <table>
          <Section type="body" data={records} rows={genBodyRows} />
        </table>
      );

      const tBody = table.querySelector('tbody');

      expectTBodyStructure(tBody);
    });


    it('can render rows from generator yielding DOM elements without ' +
       '`data` prop',
    () => {
      function* genDomRows() {
        yield (
          <tr key="dom">
            <td>
              DOM cell
            </td>
          </tr>
        );
      }

      const table = TestUtils.renderIntoDocument(
        <table>
          <Section type="body" rows={genDomRows} />
        </table>
      );

      const tBody = table.querySelector('tbody');

      expect(tBody.rows).to.have.length(1);
      expect(tBody.rows[0].cells).to.have.length(1);
      expect(tBody.rows[0].cells[0].firstChild.data).to.equal('DOM cell');
    });


    it('can render elements passed as children', () => {
      const table = TestUtils.renderIntoDocument(
        <table>
          <Section type="body">
            <Row data={records[0]} cells={genCells} />
          </Section>
        </table>
      );

      const tBody = table.querySelector('tbody');

      expectTBodyStructure(tBody);
    });


    it('passes all props except for `type`, `data` or `rows` to actual ' +
       'section element',
    () => {
      const table = TestUtils.renderIntoDocument(
        <table>
          <Section type="body" className="simple" />
        </table>
      );

      const tBody = table.querySelector('tbody');

      expect(tBody.className).to.equal('simple');
    });
  });


  describe('Row', () => {
    it('can render cells dynamically from generator yielding Cell ' +
       'elements from `data` prop',
    () => {
      const table = TestUtils.renderIntoDocument(
        <table><tbody>
          <Row data={records[0]} cells={genCells} />
        </tbody></table>
      );

      const row = table.querySelector('tr');

      expectRowStructure(row);
    });


    it('can render cells from generator yielding DOM elements without ' +
       '`data` prop',
    () => {
      function* genDomCell() {
        yield (
          <td key="dom">
            DOM cell
          </td>
        );
      }

      const table = TestUtils.renderIntoDocument(
        <table><tbody>
          <Row cells={genDomCell} />
        </tbody></table>
      );

      const row = table.querySelector('tr');

      expect(row.cells).to.have.length(1);
      expect(row.cells[0].firstChild.data).to.equal('DOM cell');
    });


    it('can render elements passed as children', () => {
      const table = TestUtils.renderIntoDocument(
        <table><tbody>
          <Row>
            <Cell>
              {records[0].field}
            </Cell>
          </Row>
        </tbody></table>
      );

      const row = table.querySelector('tr');

      expectRowStructure(row);
    });


    it('passes all props except for `data` or `cells` to actual row element',
    () => {
      const table = TestUtils.renderIntoDocument(
        <table><tbody>
          <Row className="info" />
        </tbody></table>
      );

      const row = table.querySelector('tr');

      expect(row.className).to.equal('info');
    });
  });


  describe('Cell', () => {
    it('renders `td` tag by default', () => {
      const table = TestUtils.renderIntoDocument(
        <table><tbody><tr>
          <Cell />
        </tr></tbody></table>
      );

      expect(table.tBodies[0].rows[0].cells[0].tagName).to.equal('TD');
    });


    it('renders different type of table cell based on `tag` prop', () => {
      const table = TestUtils.renderIntoDocument(
        <table><thead><tr>
          <Cell tag="th" />
        </tr></thead></table>
      );

      expect(table.tHead.rows[0].cells[0].tagName).to.equal('TH');
    });


    it('can render elements passed as children', () => {
      const table = TestUtils.renderIntoDocument(
        <table><tbody><tr>
          <Cell>
            {records[0].field}
          </Cell>
        </tr></tbody></table>
      );

      const cell = table.querySelector('td');

      expectCellStructure(cell);
    });


    it('passes all props except for `tag` to actual cell element', () => {
      const table = TestUtils.renderIntoDocument(
        <table><tbody><tr>
          <Cell className="field">
            {records[0].field}
          </Cell>
        </tr></tbody></table>
      );

      const cell = table.querySelector('td');

      expect(cell.className).to.equal('field');
    });
  });
});
