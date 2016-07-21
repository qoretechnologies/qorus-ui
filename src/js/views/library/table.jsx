/* @flow */
import React from 'react';

import Table, { Section, Row, Cell } from '../../components/table';
import LibraryRow from './row';

type Props = {
  name: string,
  collection: Array<Object>,
  onClick: () => void,
}

const LibraryTable: Function = ({ name, collection, onClick }: Props): React.Element<any> => (
  <div className="library-view__block">
    <h4 className="detail-title"> { name } </h4>
    <Table className="table table-condensed table-striped table-hover table-fixed table--data">
      <Section type="head">
        <Row>
          <Cell tag="th"> ID </Cell>
          <Cell tag="th"> Name </Cell>
          <Cell tag="th"> Version </Cell>
        </Row>
      </Section>
      <Section type="body">
        { collection.map((c, index) => (
          <LibraryRow
            key={index}
            onClick={onClick}
            id={c.id}
          >
            <Cell>{ c.id }</Cell>
            <Cell>{ c.name }</Cell>
            <Cell>{ c.version }</Cell>
          </LibraryRow>
        )) }
      </Section>
    </Table>
  </div>
);

export default LibraryTable;
