import React, { PropTypes } from 'react';

import Table, { Section, Row, Cell } from 'components/table';


const renderRows = (data) => {
  if (!data) return undefined;

  return Object.keys(data).map((d, key) => (
    <Section type="body" key={key}>
      <Row>
        <Cell>{ d }</Cell>
        <Cell>{ data[d] }</Cell>
      </Row>
    </Section>
  ));
};

export default function DiagramKeysTable(props) {
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
        { renderRows(props.data) }
      </Table>
    </div>
  );
}

DiagramKeysTable.propTypes = {
  data: PropTypes.object.isRequired,
};
