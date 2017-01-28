import React from 'react';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

import { Table, Thead, Tbody, Tfooter, Tr, Th, Td } from '../../src/js/components/new_table';

describe('Table, Sections, Row and Cell from components/table', () => {
  before(() => {
    chai.use(spies);
  });

  describe('Table', () => {
    it('renders simple table', () => {
      const wrapper = mount(
        <Table />
      );

      expect(wrapper.find('table').hasClass('table')).to.eql(true);
      expect(wrapper.find('table').hasClass('table--data')).to.eql(true);
    });

    it('renders table with children', () => {
      const wrapper = mount(
        <Table>
          <tbody>
            <tr>
              <td> Hello </td>
            </tr>
          </tbody>
        </Table>
      );

      expect(wrapper.find('tbody')).to.have.length(1);
      expect(wrapper.find('tr')).to.have.length(1);
      expect(wrapper.find('td')).to.have.length(1);
      expect(wrapper.find('td').first().text()).to.eql(' Hello ');
    });

    it('renders table with predefined classes', () => {
      const wrapper = mount(
        <Table hover condensed striped />
      );

      expect(wrapper.find('table').hasClass('table-hover')).to.eql(true);
      expect(wrapper.find('table').hasClass('table-striped')).to.eql(true);
      expect(wrapper.find('table').hasClass('table-condensed')).to.eql(true);
    });

    it('renders table with predefined & custom classes', () => {
      const wrapper = mount(
        <Table hover className="table-custom" />
      );

      expect(wrapper.find('table').hasClass('table')).to.eql(true);
      expect(wrapper.find('table').hasClass('table--data')).to.eql(true);
      expect(wrapper.find('table').hasClass('table-hover')).to.eql(true);
      expect(wrapper.find('table').hasClass('table-custom')).to.eql(true);
    });

    it('renders table with fixed header and auto height', () => {
      const wrapper = mount(
        <Table fixed hover striped className="table-custom">
          <Thead />
          <Tbody />
          <Tfooter />
        </Table>
      );

      expect(wrapper.find('div')).to.have.length(4);
      expect(wrapper.find('tbody').first().props().style.height).to.eql('auto');
      expect(wrapper.find('.table-body-wrapper table').hasClass('table')).to.eql(true);
      expect(wrapper.find('.table-body-wrapper table').hasClass('table--data')).to.eql(true);
      expect(wrapper.find('.table-body-wrapper table').hasClass('table-hover')).to.eql(true);
      expect(wrapper.find('.table-body-wrapper table').hasClass('table-custom')).to.eql(true);
      expect(wrapper.find('.table-body-wrapper table').hasClass('table-striped')).to.eql(true);
    });
  });

  describe('Tbody, Thead and Tfooter', () => {
    it('renders sections', () => {
      const wrapper = mount(
        <Table>
          <Thead>
            <tr />
          </Thead>
          <Tbody />
          <Tfooter />
        </Table>
      );

      expect(wrapper.find('thead')).to.have.length(1);
      expect(wrapper.find('tbody')).to.have.length(1);
      expect(wrapper.find('tfoot')).to.have.length(1);
    });

    it('renders children correctly', () => {
      const wrapper = mount(
        <Table>
          <Thead>
            <tr />
          </Thead>
          <Tbody>
            <tr />
          </Tbody>
          <Tfooter>
            <tr />
          </Tfooter>
        </Table>
      );

      expect(wrapper.find('tr')).to.have.length(3);
    });
  });

  describe('Tr', () => {
    it('renders row with custom class and children', () => {
      const wrapper = mount(
        <Table>
          <Tbody>
            <Tr className="info">
              <td />
            </Tr>
          </Tbody>
        </Table>
      );

      expect(wrapper.find('tr')).to.have.length(1);
      expect(wrapper.find('td')).to.have.length(1);
      expect(wrapper.find('tr').first().hasClass('info')).to.eql(true);
    });

    it('renders row and passes all sorting data to ths', () => {
      const onSortAction = chai.spy();
      const wrapper = mount(
        <Table>
          <Tbody>
            <Tr
              sortData={{
                sortBy: 'test',
                sortByKey: {
                  direction: 1,
                },
              }}
              onSortChange={onSortAction}
            >
              <Th name="test"> Test </Th>
              <Th name="anotherTest"> Another Test </Th>
            </Tr>
          </Tbody>
        </Table>
      );

      wrapper.find('th').last().simulate('click');

      expect(wrapper.find(Th).first().props().sortData).to.be.an('object');
      expect(wrapper.find(Th).first().props().onSortChange).to.be.a('function');
      expect(wrapper.find(Th).last().props().sortData).to.be.an('object');
      expect(wrapper.find(Th).last().props().onSortChange).to.be.a('function');
      expect(onSortAction).to.have.been.called().with({ sortBy: 'anotherTest' });
    });

    it('runs the handleHighlightEnd function after 2500ms', function onDone(done) {
      this.timeout(2600);
      const func = chai.spy();
      const wrapper = mount(
        <Tr
          onHighlightEnd={func}
        />
      );

      wrapper.setProps({ highlight: true });

      setTimeout(() => {
        expect(func).to.have.been.called();
        done();
      }, 2500);
    });
  });

  describe('Th', () => {
    it('renders simple th', () => {
      const wrapper = mount(
        <Table>
          <Tbody>
            <Tr>
              <Th> Hello </Th>
            </Tr>
          </Tbody>
        </Table>
      );

      expect(wrapper.find('th')).to.have.length(1);
      expect(wrapper.find('th').first().text()).to.eql(' Hello ');
    });

    it('renders th with custom className', () => {
      const wrapper = mount(
        <Table>
          <Tbody>
            <Tr>
              <Th className="custom-class"> Hello </Th>
            </Tr>
          </Tbody>
        </Table>
      );

      expect(wrapper.find('th').first().hasClass('custom-class')).to.eql(true);
    });

    it('renders th correct sorting css', () => {
      const wrapper = mount(
        <Table>
          <Tbody>
            <Tr>
              <Th
                className="custom-class"
                sortData={{
                  sortBy: 'test',
                  sortByKey: {
                    direction: -1,
                  },
                }}
                name="test"
              >
                Hello
              </Th>
            </Tr>
          </Tbody>
        </Table>
      );

      expect(wrapper.find('th').first().hasClass('sort')).to.eql(true);
      expect(wrapper.find('th').first().hasClass('custom-class')).to.eql(true);
      expect(wrapper.find('th').first().hasClass('sort-desc')).to.eql(true);
    });

    it('runs the provided functions when clicked', () => {
      const onSortAction = chai.spy();
      const onClickAction = chai.spy();
      const wrapper = mount(
        <Table>
          <Tbody>
            <Tr>
              <Th
                onSortChange={onSortAction}
                onClick={onClickAction}
                name="test"
              >
                Hello
              </Th>
            </Tr>
          </Tbody>
        </Table>
      );

      wrapper.find('th').simulate('click');

      expect(onSortAction).to.have.been.called().with({ sortBy: 'test' });
      expect(onClickAction).to.have.been.called();
    });
  });

  describe('Td', () => {
    it('renders simple td', () => {
      const wrapper = mount(
        <Table>
          <Tbody>
            <Tr>
              <Td> Hello </Td>
            </Tr>
          </Tbody>
        </Table>
      );

      expect(wrapper.find('td')).to.have.length(1);
      expect(wrapper.find('td').first().text()).to.eql(' Hello ');
    });
  });
});
