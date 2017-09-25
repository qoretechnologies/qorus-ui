// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

import Toolbar from '../../../components/toolbar';
import { Controls, CondControl as Button } from '../../../components/controls';
import Search from '../../../containers/search';
import queryControl from '../../../hocomponents/queryControl';
import withModal from '../../../hocomponents/modal';
import SLAModal from './modal';
import { hasPermission } from '../../../helpers/user';

type Props = {
  searchQuery?: string,
  changeSearchQuery: Function,
  openModal: Function,
  closeModal: Function,
  handleAddClick: Function,
  onCreate: Function,
  perms: Array<string>,
};

const SLAToolbar: Function = ({
  searchQuery,
  changeSearchQuery,
  handleAddClick,
  perms,
}: Props): React.Element<any> => (
  <Toolbar>
    <div className="pull-left">
      <Controls noControls>
        <Button
          big
          btnStyle="success"
          icon="plus"
          label="Add new"
          onClick={handleAddClick}
          perms={perms}
          condition={(props) => hasPermission(props.perms, ['CREATE-SLA', 'SLA-CONTROL'], 'or')}
        />
      </Controls>
    </div>
    <Search
      defaultValue={searchQuery}
      onSearchUpdate={changeSearchQuery}
      resource="slas"
    />
  </Toolbar>
);

export default compose(
  queryControl('search'),
  withModal(),
  withHandlers({
    handleAddClick: ({ openModal, closeModal, onCreate }: Props): Function => (): void => {
      openModal(
        <SLAModal
          onClose={closeModal}
          onSubmit={onCreate}
        />
      );
    },
  }),
  pure([
    'searchQuery',
  ])
)(SLAToolbar);
