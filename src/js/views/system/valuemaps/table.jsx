/* @flow */
import React from 'react';
import compose from 'recompose/compose';

import sort from '../../../hocomponents/sort';
import checkNoData from '../../../hocomponents/check-no-data';
import { sortDefaults } from '../../../constants/sort';
import Table, { Section, Row, Th } from '../../../components/table';
import ValueRow from './row';

type Props = {
  collection: Array<Object>,
  openPane: Function,
  sortData: Object,
  onSortChange: Function,
}

const ValuemapsTable: Function = ({
  collection,
  openPane,
  sortData,
  onSortChange,
}: Props): React.Element<any> => (
  <Table className="table table--data table-condensed table-striped">
    <Section type="head">
      <Row>
        <Th {...{ sortData, onSortChange }} name="name">Name</Th>
        <Th {...{ sortData, onSortChange }} name="desc">Description</Th>
        <Th {...{ sortData, onSortChange }} name="author">Author</Th>
        <Th {...{ sortData, onSortChange }} name="valuetype">Type</Th>
        <Th {...{ sortData, onSortChange }} name="mapsize">Size</Th>
        <Th {...{ sortData, onSortChange }} name="created">Created</Th>
        <Th {...{ sortData, onSortChange }} name="modified">Modified</Th>
        <Th>Dump</Th>
      </Row>
    </Section>
    <Section type="body">
      {collection.map((valuemap: Object): React.Element<any> => (
        <ValueRow
          data={valuemap}
          key={`valuemap_${valuemap.id}`}
          openPane={openPane}
        />
      ))}
    </Section>
  </Table>
);

export default compose(
  sort(
    'valuemaps',
    'collection',
    sortDefaults.valuemaps,
  ),
  checkNoData(({ collection }) => collection.length)
)(ValuemapsTable);
