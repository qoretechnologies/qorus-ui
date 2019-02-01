// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import Flex from '../../components/Flex';
import actions from '../../store/api/actions';
import withDispatch from '../../hocomponents/withDispatch';
import showIfPassed from '../../hocomponents/show-if-passed';
import lifecycle from 'recompose/lifecycle';
import Loader from '../../components/loader';
import PaneItem from '../../components/pane_item';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import {
  Table,
  Thead,
  FixedRow,
  Th,
  Tbody,
  Tr,
  Td,
} from '../../components/new_table';
import NameColumn, { NameColumnHeader } from '../../components/NameColumn';
import ContentByType from '../../components/ContentByType';
import NewLoggerPopover from './popovers/logger';
import NewAppenderPopover from './popovers/appender';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import Alert from '../../components/alert';
import { Popover, Position } from '@blueprintjs/core';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { fetchWithNotifications, del } from '../../store/api/utils';
import settings from '../../settings';

type LoggerContainerProps = {
  logger: Object,
  appenders: Array<Object>,
  id: number,
  resource: string,
  handleLoggerDeleteClick: Function,
};

const LoggerContainer: Function = ({
  logger,
  appenders,
  isLoggerPopoverOpen,
  isAppenderPopoverOpen,
  toggleLoggerPopover,
  toggleAppenderPopover,
  resource,
  id,
  handleLoggerDeleteClick,
}: LoggerContainerProps): React.Element<any> => (
  <Flex>
    {logger.isDefault && (
      <React.Fragment>
        <Alert bsStyle="warning">This interface is using default logger</Alert>
      </React.Fragment>
    )}
    <PaneItem
      title="Logger"
      label={
        <ButtonGroup>
          {logger.isDefault ? (
            <Popover
              content={
                <NewLoggerPopover
                  resource={resource}
                  id={id}
                  onCancel={() => toggleLoggerPopover(() => false)}
                />
              }
              position={Position.LEFT_TOP}
              isOpen={isLoggerPopoverOpen}
            >
              <Button
                text="Add logger"
                icon="add"
                stopPropagation
                onClick={() => toggleLoggerPopover(() => true)}
              />
            </Popover>
          ) : (
            <React.Fragment>
              <Popover
                content={
                  <NewLoggerPopover
                    resource={resource}
                    id={id}
                    data={logger}
                    onCancel={() => toggleLoggerPopover(() => false)}
                  />
                }
                position={Position.LEFT_TOP}
                isOpen={isLoggerPopoverOpen}
              >
                <Button
                  text="Edit logger"
                  icon="edit"
                  stopPropagation
                  onClick={() => toggleLoggerPopover(() => true)}
                />
              </Popover>
              <Button
                text="Delete logger"
                btnStyle="danger"
                icon="remove"
                onClick={handleLoggerDeleteClick}
              />
            </React.Fragment>
          )}
        </ButtonGroup>
      }
    >
      <Table fixed striped>
        <Thead>
          <FixedRow>
            <NameColumnHeader />
            <Th icon="info-sign">Level</Th>
            <Th icon="info-sign">Additivity</Th>
          </FixedRow>
        </Thead>
        <Tbody>
          <Tr first>
            <NameColumn name={logger.name} />
            <Td>{Object.keys(logger.level)[0]}</Td>
            <Td>
              <ContentByType content={logger.additivity} />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </PaneItem>
    <PaneItem
      title="Appenders"
      label={
        !logger.isDefault && (
          <Popover
            content={
              <NewAppenderPopover
                resource={resource}
                id={id}
                onCancel={() => toggleAppenderPopover(() => false)}
              />
            }
            position={Position.LEFT_TOP}
            isOpen={isAppenderPopoverOpen}
          >
            <Button
              text="Add appender"
              icon="add"
              stopPropagation
              onClick={() => toggleAppenderPopover(() => true)}
            />
          </Popover>
        )
      }
    >
      <Table fixed condensed striped>
        <Thead>
          <FixedRow>
            <NameColumnHeader />
            <Th className="text" icon="info-sign">
              Type
            </Th>
            <Th className="text" icon="info-sign">
              Layout Pattern
            </Th>
            <Th icon="info-sign">Rotation Count</Th>
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={size(appenders) === 0} cols={4}>
          {(props: Object) => (
            <Tbody {...props}>
              {appenders.map(
                (appender: Object, index: number): any => (
                  <Tr first={index === 0} key={appender.id}>
                    <NameColumn name={appender.name} />
                    <Td className="text">{appender.type}</Td>
                    <Td className="text">{appender.layoutPattern}</Td>
                    <Td>{appender.rotationCount}</Td>
                  </Tr>
                )
              )}
            </Tbody>
          )}
        </DataOrEmptyTable>
      </Table>
    </PaneItem>
  </Flex>
);

export default compose(
  connect((state, ownProps) => {
    const { logger, appenders }: Object = state.api[
      ownProps.resource
    ].data.find((res: Object): boolean => res.id === ownProps.id);

    return {
      logger,
      appenders,
    };
  }),
  withDispatch(),
  lifecycle({
    componentDidMount () {
      const { id, resource, dispatchAction, logger } = this.props;

      if (!logger) {
        dispatchAction(actions[resource].fetchLogger, id);
      }
    },
    componentWillReceiveProps (nextProps: LoggerContainerProps) {
      if (this.props.id !== nextProps.id) {
        nextProps.dispatchAction(
          actions[nextProps.resource].fetchLogger,
          nextProps.id
        );
      }
    },
  }),
  showIfPassed(({ logger }) => logger, <Loader />),
  withState('isLoggerPopoverOpen', 'toggleLoggerPopover', false),
  withState('isAppenderPopoverOpen', 'toggleAppenderPopover', false),
  withHandlers({
    handleLoggerDeleteClick: ({
      dispatch,
      resource,
      id,
    }: LoggerContainerProps): Function => (): void => {
      fetchWithNotifications(
        async () => del(`${settings.REST_BASE_URL}/${resource}/${id}/logger`),
        `Removing logger...`,
        `Logger successfuly removed`,
        dispatch
      );
    },
  }),
  onlyUpdateForKeys([
    'logger',
    'appenders',
    'isLoggerPopoverOpen',
    'isAppenderPopoverOpen',
  ])
)(LoggerContainer);
