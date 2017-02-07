// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

import { Tr, Td } from '../../components/new_table';
import Checkbox from '../../components/checkbox';
import Controls from './controls';
import actions from '../../store/api/actions';
import queryControl from '../../hocomponents/queryControl';

type Props = {
  updateDone: Function,
  select: Function,
  _updated?: boolean,
  handleHighlightEnd: Function,
  handleCheckboxClick: Function,
  _selected?: boolean,
  id: number,
  enabled: boolean,
  workflows_count: number,
  services_count: number,
  jobs_count: number,
  vmaps_count: number,
  roles_count: number,
  mappers_count: number,
  handleEnableClick: Function,
  handleNameClick: Function,
  changeGroupQuery: Function,
  action: Function,
  name: string,
  description: string,
};

const ServiceRow: Function = ({
  _updated,
  handleHighlightEnd,
  handleCheckboxClick,
  _selected,
  id,
  enabled,
  name,
  description,
  workflows_count: workflowsCount,
  services_count: servicesCount,
  jobs_count: jobsCount,
  vmaps_count: vmapsCount,
  roles_count: rolesCount,
  mappers_count: mappersCount,
  handleNameClick,
}: Props): React.Element<any> => (
  <Tr
    highlight={_updated}
    onHighlightEnd={handleHighlightEnd}
  >
    <Td className="tiny checker">
      <Checkbox
        action={handleCheckboxClick}
        checked={_selected ? 'CHECKED' : 'UNCHECKED'}
      />
    </Td>
    <Td className="medium">
      <Controls
        enabled={enabled}
        name={name}
      />
    </Td>
    <Td className="narrow">{id}</Td>
    <Td className="name">
      <a className="resource-name-link" onClick={handleNameClick}>
        {name}
      </a>
    </Td>
    <Td className="text">
      <p>{ description }</p>
    </Td>
    <Td className="medium">{workflowsCount}</Td>
    <Td className="medium">{servicesCount}</Td>
    <Td className="medium">{jobsCount}</Td>
    <Td className="medium">{vmapsCount}</Td>
    <Td className="medium">{rolesCount}</Td>
    <Td className="medium">{mappersCount}</Td>
  </Tr>
);

export default compose(
  connect(
    null,
    {
      action: actions.groups.groupAction,
    }
  ),
  queryControl('group'),
  withHandlers({
    handleNameClick: ({
      changeGroupQuery,
      name,
    }: Props): Function => (event: EventHandler): void => {
      event.preventDefault();

      changeGroupQuery(name);
    },
    handleCheckboxClick: ({ select, id }: Props): Function => (): void => {
      select(id);
    },
    handleHighlightEnd: ({ updateDone, name }: Props): Function => (): void => {
      updateDone(name);
    },
  }),
  pure([
    'enabled',
    '_selected',
    '_updated',
  ])
)(ServiceRow);
