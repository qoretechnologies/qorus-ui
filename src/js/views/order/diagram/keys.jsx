import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import Table, { Section, Row, Cell } from 'components/table';
import PaneItem from '../../../components/pane_item';
import NoData from '../../../components/nodata';

const DiagramKeysTable: Function = ({
  data,
}: {
  data?: Object,
}): React.Element<any> => (
  <PaneItem title="Keys">
    {data ? (
      <Table className="table table-bordered table-condensed">
        <Section type="head">
          <Row>
            <Cell tag="th"> Key </Cell>
            <Cell tag="th"> Value </Cell>
          </Row>
        </Section>
        <Section type="body">
          {Object.keys(data).map((d, key) => {
            const val: string =
              typeof data[d] === 'object' ? data[d].join(', ') : data[d];

            return (
              <Row key={key}>
                <Cell>{d}</Cell>
                <Cell>{val}</Cell>
              </Row>
            );
          })}
        </Section>
      </Table>
    ) : (
      <NoData />
    )}
  </PaneItem>
);

export default pure(['data'])(DiagramKeysTable);
