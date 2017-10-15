import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

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
          Object.keys(data).map((d, key) => {
            const val: string = typeof data[d] === 'object' ? data[d].join(', ') : data[d];

            return (
              <Row key={key}>
                <Cell>{ d }</Cell>
                <Cell>{ val }</Cell>
              </Row>
            );
          })
        ) : (
          <Row>
            <Cell colspan={2}> No data </Cell>
          </Row>
        )}
      </Section>
    </Table>
  </div>
);

export default pure(['data'])(DiagramKeysTable);
