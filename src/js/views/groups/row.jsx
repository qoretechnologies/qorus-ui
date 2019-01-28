// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

import { Tr, Td } from '../../components/new_table';
import Controls from './controls';
import actions from '../../store/api/actions';
import { SelectColumn } from '../../components/SelectColumn';
import { IdColumn } from '../../components/IdColumn';
import NameColumn from '../../components/NameColumn';
import { ActionColumn } from '../../components/ActionColumn';
import { DescriptionColumn } from '../../components/DescriptionColumn';

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
  isTablet: boolean,
  first: boolean,
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
  isTablet,
  first,
}: Props): React.Element<any> => (
  <Tr
    first={first}
    highlight={_updated}
    onHighlightEnd={handleHighlightEnd}
    className={_selected ? 'row-selected' : ''}
    onClick={handleCheckboxClick}
  >
    <SelectColumn onClick={handleCheckboxClick} checked={_selected} />
    <IdColumn>{id}</IdColumn>
    <NameColumn name={name} link={`/groups?group=${name}`} type="groups" />
    <ActionColumn>
      <Controls enabled={enabled} name={name} />
    </ActionColumn>
    <Td className={isTablet ? 'narrow' : 'medium'}>{workflowsCount}</Td>
    <Td className={isTablet ? 'narrow' : 'medium'}>{servicesCount}</Td>
    <Td className={isTablet ? 'narrow' : 'medium'}>{jobsCount}</Td>
    <Td className={isTablet ? 'narrow' : 'medium'}>{vmapsCount}</Td>
    <Td className={isTablet ? 'narrow' : 'medium'}>{rolesCount}</Td>
    <Td className={isTablet ? 'narrow' : 'medium'}>{mappersCount}</Td>
    <DescriptionColumn>{description}</DescriptionColumn>
  </Tr>
);

export default compose(
  connect(
    null,
    {
      action: actions.groups.groupAction,
    }
  ),
  withHandlers({
    handleCheckboxClick: ({ select, id }: Props): Function => (): void => {
      select(id);
    },
    handleHighlightEnd: ({ updateDone, name }: Props): Function => (): void => {
      updateDone(name);
    },
  })
)(ServiceRow);
