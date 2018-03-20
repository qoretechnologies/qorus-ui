import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import Table, { Section, Row, Cell } from '../../src/js/components/table';

chai.use(spies);

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


  describe('Table', () => {
    it('can render dynamic tabular data from generator yielding other ' +
       'Section elements from `data` prop',
    () => {
      function* genTBodySection(recs) {
        yield (
          <Section key="body" type="body" data={recs} rows={genBodyRows} />
        );
      }

      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Table data={records} sections={genTBodySection} />
      );
      const table = renderer.getRenderOutput();

      expect(table.type).to.equal('table');
      expect(table.props.children.type).to.equal(Section);
      expect(table.props.children.props.type).to.equal('body');
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

      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Table sections={genDomBodyRows} />
      );
      const table = renderer.getRenderOutput();

      expect(
        table.props.children.type
      ).to.equal('tbody');
      expect(
        table.props.children.props.children.type
      ).to.equal('tr');
      expect(
        table.props.children.props.children.props.children.type
      ).to.equal('td');
      expect(
        table.props.children.props.children.props.children.props.children
      ).to.equal('DOM cell');
    });


    it('can render elements passed as children', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Table>
          <Section type="body" data={records} rows={genBodyRows} />
        </Table>
      );
      const table = renderer.getRenderOutput();

      expect(table.props.children.type).to.equal(Section);
      expect(table.props.children.props.type).to.equal('body');
    });


    it('passes all props except for `data` or `sections` to actual table ' +
       'element',
    () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Table className="data" />
      );
      const table = renderer.getRenderOutput();

      expect(table.props.className).to.equal('data');
    });
  });


  describe('Section', () => {
    it('renders different type of table section based on `type` prop',
    () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Section type="body" />
      );
      const tBody = renderer.getRenderOutput();

      expect(tBody.type).to.equal('tbody');
    });


    it('can render rows dynamically from generator yielding Row ' +
       'elements from `data` prop',
    () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Section type="body" data={records} rows={genBodyRows} />
      );
      const tBody = renderer.getRenderOutput();

      expect(tBody.props.children.type).to.equal(Row);
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

      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Section type="body" rows={genDomRows} />
      );
      const tBody = renderer.getRenderOutput();

      expect(
        tBody.props.children.type
      ).to.equal('tr');
      expect(
        tBody.props.children.props.children.type
      ).to.equal('td');
      expect(
        tBody.props.children.props.children.props.children
      ).to.equal('DOM cell');
    });


    it('can render elements passed as children', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Section type="body">
          <Row data={records[0]} cells={genCells} />
        </Section>
      );
      const tBody = renderer.getRenderOutput();

      expect(tBody.props.children.type).to.equal(Row);
    });


    it('passes all props except for `type`, `data` or `rows` to actual ' +
       'section element',
    () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Section type="body" className="simple" />
      );
      const tBody = renderer.getRenderOutput();

      expect(tBody.props.className).to.equal('simple');
    });
  });


  describe('Row', () => {
    it('can render cells dynamically from generator yielding Cell ' +
       'elements from `data` prop',
    () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Row data={records[0]} cells={genCells} />
      );
      const row = renderer.getRenderOutput();

      expect(row.type).to.equal('tr');
      expect(row.props.children.type).to.equal(Cell);
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

      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Row cells={genDomCell} />
      );
      const row = renderer.getRenderOutput();

      expect(row.props.children.type).to.equal('td');
      expect(row.props.children.props.children).to.equal('DOM cell');
    });


    it('can render elements passed as children', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Row>
          <Cell>value</Cell>
        </Row>
      );
      const row = renderer.getRenderOutput();

      expect(row.props.children.type).to.equal(Cell);
      expect(row.props.children.props.children).to.equal('value');
    });


    it('passes all props except for `data` or `cells` to actual row element',
    () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Row className="info" />
      );
      const row = renderer.getRenderOutput();

      expect(row.props.className).to.equal('info');
    });

    it('adds the row-highlight class if highlight prop is true', () => {
      const comp = mount(
        <Row highlight />
      );

      expect(comp.find('tr').hasClass('row-highlight')).to.eql(true);
    });

    xit('runs the onHighlightEnd function after 2500ms', function onDone(done) {
      this.timeout(2600);
      const func = chai.spy();

      mount(
        <Row
          highlight
          onHighlightEnd={func}
        />
      );

      setTimeout(() => {
        expect(func).to.have.been.called();
        done();
      }, 2500);
    });
  });


  describe('Cell', () => {
    it('renders `td` tag by default', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Cell />
      );
      const cell = renderer.getRenderOutput();

      expect(cell.type).to.equal('td');
    });


    it('renders different type of table cell based on `tag` prop', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Cell tag="th" />
      );
      const cell = renderer.getRenderOutput();

      expect(cell.type).to.equal('th');
    });


    it('can render elements passed as children', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Cell>value</Cell>
      );
      const cell = renderer.getRenderOutput();

      expect(cell.props.children[0]).to.equal('value');
    });


    it('passes all props except for `tag` to actual cell element', () => {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <Cell className="field" />
      );
      const cell = renderer.getRenderOutput();

      expect(cell.props.className).to.equal('field');
    });
  });
});
