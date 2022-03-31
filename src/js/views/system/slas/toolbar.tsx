// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import Search from '../../../containers/search';
import { hasPermission } from '../../../helpers/user';
import withModal from '../../../hocomponents/modal';
import queryControl from '../../../hocomponents/queryControl';
import SLAModal from './modal';

type Props = {
  searchQuery?: string;
  changeSearchQuery: Function;
  openModal: Function;
  closeModal: Function;
  handleAddClick: Function;
  onCreate: Function;
  perms: Array<string>;
};

const SLAToolbar: Function = ({
  searchQuery,
  changeSearchQuery,
  handleAddClick,
  perms,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Headbar>
    <Breadcrumbs>
      <Crumb active> SLAs </Crumb>
    </Breadcrumbs>
    <Pull right>
      <ButtonGroup marginRight={3}>
        <Button
          disabled={!hasPermission(perms, ['CREATE-SLA', 'SLA-CONTROL'], 'or')}
          icon="plus"
          text={intl.formatMessage({ id: 'button.add-new' })}
          onClick={handleAddClick}
          big
        />
      </ButtonGroup>
      <Search defaultValue={searchQuery} onSearchUpdate={changeSearchQuery} resource="slas" />
    </Pull>
  </Headbar>
);

export default compose(
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  withModal(),
  withHandlers({
    handleAddClick:
      ({ openModal, closeModal }: Props): Function =>
      (): void => {
        // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
        openModal(<SLAModal onClose={closeModal} />);
      },
  }),
  pure(['searchQuery']),
  injectIntl
)(SLAToolbar);
