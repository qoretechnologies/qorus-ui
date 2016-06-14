import React, { Component, PropTypes } from 'react';

import Table, { Section, Row, Cell } from 'components/table';

export default class DiagramKeysTable extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    const { ...data } = this.props.data;

    return (
      <div>
        <h4> Keys </h4>
        <Table className="table table-bordered table-condensed">
          <Section type="head">
            <Row>
              <Cell tag="th"> Key </Cell>
              <Cell tag="th"> Value </Cell>
            </Row>
          </Section>
        </Table>
      </div>
    );
  }
}
