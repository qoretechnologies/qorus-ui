/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import pickBy from 'lodash/pickBy';
import includes from 'lodash/includes';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Table, { Section, Row, Th } from '../../../../components/table';
import sync from '../../../../hocomponents/sync';
import patch from '../../../../hocomponents/patchFuncArgs';
import { resourceSelector, querySelector } from '../../../../selectors';
import {
  fetchValues,
  updateValue,
  deleteValue,
} from '../../../../store/api/resources/valuemaps/actions';
import DetailRow from './row';

type Props = {
  paneId: number,
  data: Object,
  onSortChange: Function,
  sortData: Object,
  update: Function,
  remove: Function,
}

const DetailTable: Function = ({ update, remove, paneId, data }: Props): React.Element<any> => (
  <Table className="table table--data table-condensed table-striped">
    <Section type="head">
      <Row>
        <Th> Key </Th>
        <Th> Value </Th>
        <Th> Actions </Th>
      </Row>
    </Section>
    <Section type="body">
      {Object.keys(data).map((key: string): React.Element<any> => (
        <DetailRow
          key={`value_${key}`}
          id={paneId}
          name={key}
          data={data[key]}
          onUpdate={update}
          onRemoveClick={remove}
        />
      ))}
    </Section>
  </Table>
);

const findValuemap: Function = (id: number): Function => (data: Array<Object>): Object => {
  const vm = data.find((valuemap: Object): boolean => valuemap.id === parseInt(id, 10));

  return vm && vm.vals ? vm.vals : { sync: false, loading: false, data: {} };
};

const filterValues: Function = (query: string): Function => (data: Object): Object => (
  pickBy(data, (value, key) => (
    query ? includes(key, query) || includes(value.value, query) : true
  )
));

const valuemapId = (state: Object, props: Object): number => props.paneId;

const collectionSelector = createSelector(
  [resourceSelector('valuemaps'), valuemapId],
  (valuemaps, id) => compose(
    findValuemap(id)
  )(valuemaps.data)
);

const valuesSelector = createSelector(
  [
    collectionSelector,
    querySelector('values'),
  ], (values, query) => filterValues(query)(values.data)
);

const selector = createSelector(
  [
    collectionSelector,
    valuesSelector,
    querySelector('values'),
  ], (collection, data) => ({
    data,
    collection,
  })
);

export default compose(
  connect(
    selector,
    {
      load: fetchValues,
      update: updateValue,
      remove: deleteValue,
    }
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (this.props.paneId !== nextProps.paneId) {
        this.props.load(nextProps.paneId);
      }
    },
  }),
  patch('load', ['paneId']),
  sync('collection'),
)(DetailTable);
