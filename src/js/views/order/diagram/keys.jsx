import React from 'react';

import Table, { Section, Row, Cell } from 'components/table';

const DiagramKeysTable: Function = ({ data }: { data?: Object }): React.Element<any> => (
  <div>
    <h4> Keys </h4>
    <Table className="table table-bordered table-condensed">
      <Section type="head">
        <Row>
          <Cell tag="th"> Key </Cell>
          <Cell tag="th"> Value </Cell>
        </Row>
      </Section>
      <Section type="body">
        { data ? (
          Object.keys(data).map((d, key) => (
            <Row key={key}>
              <Cell>{ d }</Cell>
              <Cell>{ data[d] }</Cell>
            </Row>
          ))
        ) : (
          <Row>
            <Cell colspan={2}> No data </Cell>
          </Row>
        )}
      </Section>
    </Table>
  </div>
);

export default DiagramKeysTable;
