// @flow
import { ReqoreControlGroup } from '@qoretechnologies/reqore';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import { Control as Button } from '../../../components/controls';
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
  <Breadcrumbs>
    <Crumb active> SLAs </Crumb>
    <ReqoreControlGroup fixed style={{ marginLeft: 'auto' }}>
      <Button
        disabled={!hasPermission(perms, ['CREATE-SLA', 'SLA-CONTROL'], 'or')}
        icon="plus"
        text={intl.formatMessage({ id: 'button.add-new' })}
        onClick={handleAddClick}
        big
      />
      <Search defaultValue={searchQuery} onSearchUpdate={changeSearchQuery} resource="slas" />
    </ReqoreControlGroup>
  </Breadcrumbs>
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
