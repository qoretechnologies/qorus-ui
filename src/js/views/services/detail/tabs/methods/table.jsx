// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import pure from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
} from '../../../../../components/new_table';
import Icon from '../../../../../components/icon';
import sync from '../../../../../hocomponents/sync';
import actions from '../../../../../store/api/actions';
import { resourceSelector } from '../../../../../selectors';
import SLARow from './row';

type Props = {
  methods: Array<Object>,
  slas: Array<Object>,
  service: Object,
  perms: Array<string>,
  setMethod: Function,
  removeMethod: Function,
};

const MethodsTable: Function = ({
  methods,
  slas,
  service,
  perms,
  setMethod,
  removeMethod,
}: Props): React.Element<any> => (
  <Table condensed striped>
    <Thead>
      <Tr>
        <Th className="name">Name</Th>
        <Th className="tiny">
          <Icon iconName="lock" />
        </Th>
        <Th className="tiny">
          <Icon iconName="cog" />
        </Th>
        <Th className="tiny">
          <Icon iconName="pencil" />
        </Th>
        <Th className="normal">Actions</Th>
        <Th className="text">SLA</Th>
      </Tr>
    </Thead>
    <Tbody>
      {methods.map(
        (method: Object): React.Element<any> => (
          <SLARow
            key={method.service_methodid}
            service={service}
            slas={slas}
            method={method}
            perms={perms}
            setMethod={setMethod}
            removeMethod={removeMethod}
          />
        )
      )}
    </Tbody>
  </Table>
);

const viewSelector: Function = createSelector(
  [resourceSelector('slas'), resourceSelector('currentUser')],
  (meta: Object, user: Object): Object => ({
    meta,
    slas: meta.data,
    perms: user.data.permissions,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.slas.fetch,
    }
  ),
  sync('meta'),
  pure(['methods', 'slas', 'service', 'perms'])
)(MethodsTable);
