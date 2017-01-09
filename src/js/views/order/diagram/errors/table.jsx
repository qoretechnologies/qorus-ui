import React, { Component, PropTypes } from 'react';

import Table, { Section, Row, Cell } from 'components/table';
import ErrorRow from './row';

import { sortTable } from 'helpers/table';
import { pureRender } from 'components/utils';

const sortData = {
  sortBy: 'created',
  sortByKey: {
    ignoreCase: true,
    direction: -1,
  },
};

@pureRender
export default class DiagramErrorsTable extends Component {
  static propTypes = {
    data: PropTypes.array,
    expand: PropTypes.bool,
    stringifyError: PropTypes.func,
  };

  componentWillMount() {
    const data = sortTable(this.props.data, sortData);

    this.setState({
      data,
      sortData,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      const data = sortTable(nextProps.data, sortData);

      this.setState({
        data,
      });
    }
  }

  handleSortChange = ({ sortBy }) => {
    let direction = this.state.sortData.sortByKey.direction;

    if (this.state.sortData.sortBy === sortBy) {
      direction *= -1;
    }

    const sortData = {
      sortBy,
      sortByKey: {
        ignoreCase: true,
        direction,
      },
    };
    const data = sortTable(this.state.data, sortData);

    this.setState({
      data,
      sortData,
    });
  };

  renderRows() {
    return this.state.data.map((e, key) => (
      <ErrorRow
        key={key}
        data={e}
        expand={this.props.expand}
        stringifyError={this.props.stringifyError}
      />
    ));
  }

  render() {
    return (
      <Table className="table table-bordered table-condensed">
        <Section type="head">
          <Row>
            <Cell
              tag="th"
              name="severity"
              sortData={this.state.sortData}
              onSortChange={this.handleSortChange}
            >
              Severity
            </Cell>
            <Cell
              tag="th"
              name="error"
              sortData={this.state.sortData}
              onSortChange={this.handleSortChange}
            >
              Error
            </Cell>
            <Cell
              tag="th"
              name="created"
              sortData={this.state.sortData}
              onSortChange={this.handleSortChange}
            >
              Created
            </Cell>
            <Cell
              tag="th"
              name="error_desc"
              sortData={this.state.sortData}
              onSortChange={this.handleSortChange}
            >
              Description
            </Cell>
            <Cell
              tag="th"
              className="narrow"
              name="business"
              sortData={this.state.sortData}
              onSortChange={this.handleSortChange}
            >
              Business
            </Cell>
          </Row>
        </Section>
        { this.renderRows() }
      </Table>
    );
  }
}
