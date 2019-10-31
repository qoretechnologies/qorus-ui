// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

import Headbar from '../../../components/Headbar';
import Search from '../../../containers/search';
import queryControl from '../../../hocomponents/queryControl';
import withModal from '../../../hocomponents/modal';
import SLAModal from './modal';
import { hasPermission } from '../../../helpers/user';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Pull from '../../../components/Pull';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import { injectIntl } from 'react-intl';

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
  intl,
}: Props): React.Element<any> => (
  <Headbar>
    <Breadcrumbs>
      <Crumb active> SLAs </Crumb>
    </Breadcrumbs>
    <Pull right>
      <ButtonGroup marginRight={3}>
        <Button
          disabled={!hasPermission(perms, ['CREATE-SLA', 'SLA-CONTROL'], 'or')}
          iconName="plus"
          text={intl.formatMessage({ id: 'button.add-new' })}
          onClick={handleAddClick}
          big
        />
      </ButtonGroup>
      <Search
        defaultValue={searchQuery}
        onSearchUpdate={changeSearchQuery}
        resource="slas"
      />
    </Pull>
  </Headbar>
);

export default compose(
  queryControl('search'),
  withModal(),
  withHandlers({
    handleAddClick: ({
      openModal,
      closeModal,
    }: Props): Function => (): void => {
      openModal(<SLAModal onClose={closeModal} />);
    },
  }),
  pure(['searchQuery']),
  injectIntl
)(SLAToolbar);
