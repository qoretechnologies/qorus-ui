// @flow
import { Icon, Intent, Tag } from '@blueprintjs/core';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import NameColumn from '../../../components/NameColumn';
import { Td, Tr } from '../../../components/new_table';
import Text from '../../../components/text';
import { typeToString } from '../../../helpers/system';
import { hasPermission } from '../../../helpers/user';

type Props = {
  dispatchAction: Function;
  handleEditClick: Function;
  handleOptionSave: Function;
  name: string;
  status: string;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  workflow: string;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  service: string;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  job: string;
  default?: any;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  def: any;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  value: any;
  permissions: Array<string>;
  canEdit: boolean;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  stringDef: any;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  stringVal: any;
  first: boolean;
  onEditClick: any;
};

const OptionRow: Function = ({
  status,
  name,
  workflow,
  service,
  job,
  stringDef,
  stringVal,
  onEditClick,
  canEdit,
  first,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Tr first={first}>
    <Td className="narrow">
      {status === 'locked' && (
        <Icon
          title="This option is locked and cannot be changed while Qorus is running"
          icon="lock"
        />
      )}
    </Td>
    <NameColumn name={name} />
    <Td className="big">
      <Tag
        title={workflow ? 'Affecting Workflows' : ''}
        className="bp3-minimal bp3-round"
        intent={workflow ? Intent.PRIMARY : Intent.NONE}
      >
        W
      </Tag>{' '}
      <Tag
        title={service ? 'Affecting Services' : ''}
        className="bp3-minimal bp3-round"
        intent={service ? Intent.PRIMARY : Intent.NONE}
      >
        S
      </Tag>{' '}
      <Tag
        title={job ? 'Affecting Jobs' : ''}
        className="bp3-minimal bp3-round"
        intent={job ? Intent.PRIMARY : Intent.NONE}
      >
        J
      </Tag>
    </Td>
    <Td className="text">
      <Text text={stringDef} renderTree />
    </Td>
    <Td className="text">
      <Text text={stringVal} renderTree />
    </Td>
    <Td className="tiny">
      {canEdit && (
        <ButtonGroup>
          <Button
            title="Edit this option"
            icon="edit"
            onClick={onEditClick}
            className="bp3-small"
          />
        </ButtonGroup>
      )}
    </Td>
  </Tr>
);

export default compose(
  connect((state: any): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    permissions: state.api.currentUser.data.permissions,
  })),
  mapProps(
    ({ permissions, status, default: def, value, ...rest }: Props): Props => ({
      stringDef: typeToString(def),
      stringVal: typeToString(value),
      canEdit: status === 'unlocked' && hasPermission(permissions, 'OPTION-CONTROL'),
      def,
      value,
      status,
      permissions,
      ...rest,
    })
  ),
  pure(['value'])
)(OptionRow);
