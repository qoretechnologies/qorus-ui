// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Button, Intent } from '@blueprintjs/core';

import Toolbar from '../../../components/toolbar';
import Search from '../../../containers/search';
import queryControl from '../../../hocomponents/queryControl';
import withModal from '../../../hocomponents/modal';
import SLAModal from './modal';
import { hasPermission } from '../../../helpers/user';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';

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
  <Toolbar marginBottom>
    <Breadcrumbs>
      <Crumb> SLAs </Crumb>
    </Breadcrumbs>
    <Search
      defaultValue={searchQuery}
      onSearchUpdate={changeSearchQuery}
      resource="slas"
    />
    {hasPermission(perms, ['CREATE-SLA', 'SLA-CONTROL'], 'or') && (
      <Button
        intent={Intent.PRIMARY}
        icon="plus"
        text="Add new"
        onClick={handleAddClick}
        className="pull-right"
      />
    )}
  </Toolbar>
);

export default compose(
  queryControl('search'),
  withModal(),
  withHandlers({
    handleAddClick: ({
      openModal,
      closeModal,
      onCreate,
    }: Props): Function => (): void => {
      openModal(<SLAModal onClose={closeModal} onSubmit={onCreate} />);
    },
  }),
  pure(['searchQuery'])
)(SLAToolbar);
