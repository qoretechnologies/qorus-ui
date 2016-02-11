import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import spies from 'chai-spies';


import Table, { Col, Cell, THead, TBody } from '../../src/js/components/table';


describe("Table, { Cell, THead, TBody } from 'components/table'", () => {
  /**
   * Typical data structure for table.
   */
  const data = [
    { name: 'Row 1', value: 'Value 1' },
    { name: 'Row 2', value: 'Value 2' },
  ];


  /**
   * Helper component to render cell and columns data.
   */
  class ChildComp extends React.Component {
    static propTypes = {
      className: React.PropTypes.string,
      value: React.PropTypes.string,
    };

    render() {
      return (
        <span className={this.props.className}>
          {this.props.value}
        </span>
      );
    }
  }


  describe('Table', () => {
    it('renders table using THead, TBody and Cell', () => {
      const rowsColProps = rec => ({ name: rec.name });
      const valuesColProps = rec => ({ value: rec.value });
      const comp = TestUtils.renderIntoDocument(
        <Table data={data}>
          <Col
            heading="Rows"
            field="name"
            props={rowsColProps}
          />
          <Col
            heading="Values"
            field="value"
            props={valuesColProps}
          />
        </Table>
      );


      const tHead = TestUtils.findRenderedComponentWithType(comp, THead);
      const thCells = TestUtils.scryRenderedComponentsWithType(tHead, Cell);
      const tBody = TestUtils.findRenderedComponentWithType(comp, TBody);
      const tdCells = TestUtils.scryRenderedComponentsWithType(tBody, Cell);

      expect(thCells).to.have.length(2);
      expect(tdCells).to.have.length(4);


      const thRow = TestUtils.findRenderedDOMComponentWithTag(tHead, 'tr');
      const tdRows = TestUtils.scryRenderedDOMComponentsWithTag(tBody, 'tr');

      expect(thRow.cells[0].textContent).to.equal('Rows');
      expect(thRow.cells[1].textContent).to.equal('Values');

      expect(tdRows).to.have.length(2);
      expect(tdRows[0].cells[0].textContent).to.equal('Row 1');
      expect(tdRows[0].cells[1].textContent).to.equal('Value 1');
      expect(tdRows[1].cells[0].textContent).to.equal('Row 2');
      expect(tdRows[1].cells[1].textContent).to.equal('Value 2');
    });


    it('passes any other prop to table directly', () => {
      const colProps = rec => ({ value: rec.value });
      const comp = TestUtils.renderIntoDocument(
        <Table data={data} className="table">
          <Col field="value" props={colProps} />
        </Table>
      );

      const table = TestUtils.findRenderedDOMComponentWithTag(comp, 'table');

      expect(table.className).to.equal('table');
    });
  });


  describe('Cell', () => {
    it('renders table data cell passing any props and children', () => {
      const comp = TestUtils.renderIntoDocument(
        <table>
          <tbody>
            <tr>
              <Cell props={{ className: 'data' }}>value</Cell>
            </tr>
          </tbody>
        </table>
      );

      expect(comp.tBodies[0].rows[0].cells[0].tagName).to.equal('TD');
      expect(comp.tBodies[0].rows[0].cells[0].className).to.equal('data');
      expect(comp.tBodies[0].rows[0].cells[0].textContent).to.equal('value');
    });


    it('renders table data cell using given component', () => {
      const comp = TestUtils.renderIntoDocument(
        <table>
          <tbody>
            <tr>
              <Cell comp="th">value</Cell>
            </tr>
          </tbody>
        </table>
      );

      expect(comp.tBodies[0].rows[0].cells[0].tagName).to.equal('TH');
    });


    it('renders cell value from props and field props', () => {
      const comp = TestUtils.renderIntoDocument(
        <table>
          <tbody>
            <tr>
              <Cell props={{ key: 'value' }} field="key" />
            </tr>
          </tbody>
        </table>
      );

      expect(comp.tBodies[0].rows[0].cells[0].textContent).to.equal('value');
    });


    it('renders cell children and passes childProps to them', () => {
      const comp = TestUtils.renderIntoDocument(
        <table>
          <tbody>
            <tr>
              <Cell childProps={{ value: 'Passed to child' }}>
                <ChildComp className="child" />
              </Cell>
            </tr>
          </tbody>
        </table>
      );

      expect(comp.tBodies[0].rows[0].cells[0].firstElementChild.tagName).
        to.equal('SPAN');
      expect(comp.tBodies[0].rows[0].cells[0].firstElementChild.textContent).
        to.equal('Passed to child');
      expect(comp.tBodies[0].rows[0].cells[0].firstElementChild.className).
        to.equal('child');
    });


    it('ignores common attribute in props if it defined as field prop', () => {
      const comp = TestUtils.renderIntoDocument(
        <table>
          <tbody>
            <tr>
              <Cell
                field="title"
                props={{ title: 'Not an HTML DOM title attribute' }}
              />
            </tr>
          </tbody>
        </table>
      );

      expect(comp.tBodies[0].rows[0].cells[0].title).
        to.equal('');
      expect(comp.tBodies[0].rows[0].cells[0].textContent).
        to.equal('Not an HTML DOM title attribute');
    });
  });


  describe('THead', () => {
    it('renders table heading using Col specs', () => {
      const comp = TestUtils.renderIntoDocument(
        <table>
          <THead>
            <Col heading="Names" />
            <Col heading="Values" />
          </THead>
        </table>
      );

      expect(comp.tHead.rows[0].cells[0].tagName).to.equal('TH');
      expect(comp.tHead.rows[0].cells[0].textContent).to.equal('Names');
      expect(comp.tHead.rows[0].cells[1].tagName).to.equal('TH');
      expect(comp.tHead.rows[0].cells[1].textContent).to.equal('Values');
    });


    it('passes unused Col props to Cell', () => {
      const comp = TestUtils.renderIntoDocument(
        <table>
          <THead>
            <Col heading="Names" className="name" />
          </THead>
        </table>
      );

      expect(comp.tHead.rows[0].cells[0].className).to.equal('name');
    });


    it('renders empty tHead section if Cols have no heading', () => {
      const comp = TestUtils.renderIntoDocument(
        <table>
          <THead>
            <Col />
          </THead>
        </table>
      );

      expect(comp.tHead.rows).to.have.length(0);
    });
  });


  describe('TBody', () => {
    before(() => {
      chai.use(spies);
    });


    it('renders table body using field from given data specified by Col',
    () => {
      const nameColProps = rec => ({ name: rec.name, sth: 'to ignore' });
      const valueColProps = rec => ({ value: rec.value, sth: 'to ignore' });
      const comp = TestUtils.renderIntoDocument(
        <table>
          <TBody data={data}>
            <Col
              field="name"
              props={nameColProps}
            />
            <Col
              field="value"
              props={valueColProps}
            />
          </TBody>
        </table>
      );

      expect(comp.tBodies[0].rows).to.have.length(2);

      expect(comp.tBodies[0].rows[0].cells).to.have.length(2);
      expect(comp.tBodies[0].rows[0].cells[0].tagName).to.equal('TD');
      expect(comp.tBodies[0].rows[0].cells[0].textContent).to.equal('Row 1');
      expect(comp.tBodies[0].rows[0].cells[1].tagName).to.equal('TD');
      expect(comp.tBodies[0].rows[0].cells[1].textContent).to.equal('Value 1');

      expect(comp.tBodies[0].rows[1].cells).to.have.length(2);
      expect(comp.tBodies[0].rows[1].cells[0].tagName).to.equal('TD');
      expect(comp.tBodies[0].rows[1].cells[0].textContent).to.equal('Row 2');
      expect(comp.tBodies[0].rows[1].cells[1].tagName).to.equal('TD');
      expect(comp.tBodies[0].rows[1].cells[1].textContent).to.equal('Value 2');
    });


    it('renders table body using Col spec with children and dynamic childProps',
    () => {
      const colChildProps = rec => ({ value: rec.value });
      const comp = TestUtils.renderIntoDocument(
        <table>
          <TBody data={data}>
            <Col childProps={colChildProps}>
              <ChildComp />
            </Col>
          </TBody>
        </table>
      );

      expect(comp.tBodies[0].rows[0].cells[0].firstElementChild.tagName).
        to.equal('SPAN');
      expect(comp.tBodies[0].rows[0].cells[0].firstElementChild.textContent).
        to.equal('Value 1');
      expect(comp.tBodies[0].rows[1].cells[0].firstElementChild.tagName).
        to.equal('SPAN');
      expect(comp.tBodies[0].rows[1].cells[0].firstElementChild.textContent).
        to.equal('Value 2');
    });


    it('passes data record when clicked on table row', () => {
      const handler = chai.spy();

      const nameColProps = rec => ({ name: rec.name });
      const valueColProps = rec => ({ value: rec.value });
      const comp = TestUtils.renderIntoDocument(
        <table>
          <TBody data={data} onRowClick={handler}>
            <Col field="name" props={nameColProps} />
            <Col field="value" props={valueColProps} />
          </TBody>
        </table>
      );

      TestUtils.Simulate.click(comp.tBodies[0].rows[0].cells[1]);

      expect(handler).to.have.been.called.with(data[0], 0);
    });


    it('optionally highlights row from hightlight prop', () => {
      const shouldHighlight = (rec, idx) => idx === 0;
      const colProps = rec => ({ value: rec.value });
      const comp = TestUtils.renderIntoDocument(
        <table>
          <TBody data={data} shouldHighlight={shouldHighlight}>
            <Col field="value" props={colProps} />
          </TBody>
        </table>
      );

      expect(Array.from(comp.tBodies[0].rows[0].classList)).to.include('info');
    });
  });
});