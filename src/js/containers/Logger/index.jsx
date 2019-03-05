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
import { fetchWithNotifications, del, post } from '../../store/api/utils';
import settings from '../../settings';

type LoggerContainerProps = {
  logger: Object,
  appenders: Array<Object>,
  id: number,
  resource: string,
  handleLoggerDeleteClick: Function,
  handleDeleteAppenderClick: Function,
  handleLoggerDuplicateClick: Function,
};

const LoggerContainer: Function = ({
  logger,
  appenders,
  isLoggerPopoverOpen,
  isAppenderPopoverOpen,
  toggleLoggerPopover,
  toggleAppenderPopover,
  handleDeleteAppenderClick,
  resource,
  id,
  handleLoggerDeleteClick,
  handleLoggerDuplicateClick,
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
        logger.isDefault || logger === 'empty' ? (
          <React.Fragment>
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
              <ButtonGroup>
                <Button
                  text="Add new logger"
                  icon="add"
                  stopPropagation
                  onClick={() => toggleLoggerPopover(() => true)}
                />
              </ButtonGroup>
            </Popover>
            {logger !== 'empty' && (
              <ButtonGroup>
                <Button
                  text="Clone logger"
                  icon="duplicate"
                  stopPropagation
                  onClick={handleLoggerDuplicateClick}
                />
              </ButtonGroup>
            )}
          </React.Fragment>
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
              <ButtonGroup>
                <Button
                  text="Edit logger"
                  icon="edit"
                  stopPropagation
                  onClick={() => toggleLoggerPopover(() => true)}
                />
              </ButtonGroup>
            </Popover>
            <ButtonGroup>
              <Button
                text="Delete logger"
                btnStyle="danger"
                icon="remove"
                onClick={handleLoggerDeleteClick}
              />
            </ButtonGroup>
          </React.Fragment>
        )
      }
    >
      {logger !== 'empty' ? (
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
      ) : (
        <Alert bsStyle="info">No logger found for system</Alert>
      )}
    </PaneItem>
    {logger !== 'empty' && (
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
                Filename
              </Th>
              <Th className="text" icon="info-sign">
                Encoding
              </Th>
              <Th className="text" icon="info-sign">
                Layout Pattern
              </Th>
              <Th icon="refresh" title="Rotation count" />
              {!logger.isDefault && (
                <Th icon="remove" title="Remove appender" />
              )}
            </FixedRow>
          </Thead>
          <DataOrEmptyTable condition={size(appenders) === 0} cols={7}>
            {(props: Object) => (
              <Tbody {...props}>
                {appenders.map(
                  (appender: Object, index: number): any => (
                    <Tr first={index === 0} key={appender.id}>
                      <NameColumn name={appender.name} />
                      <Td className="text">
                        <ContentByType content={appender.type} />
                      </Td>
                      <Td className="text">
                        <ContentByType content={appender.filename} />
                      </Td>
                      <Td className="text">
                        <ContentByType content={appender.encoding} />
                      </Td>
                      <Td className="text">
                        <ContentByType content={appender.layoutPattern} />
                      </Td>
                      <Td className="narrow">
                        <ContentByType content={appender.rotationCount} />
                      </Td>
                      {!logger.isDefault && (
                        <Td className="tiny">
                          <ButtonGroup>
                            <Button
                              title="Remove appender"
                              btnStyle="danger"
                              icon="remove"
                              onClick={() =>
                                handleDeleteAppenderClick(appender.id)
                              }
                            />
                          </ButtonGroup>
                        </Td>
                      )}
                    </Tr>
                  )
                )}
              </Tbody>
            )}
          </DataOrEmptyTable>
        </Table>
      </PaneItem>
    )}
  </Flex>
);

export default compose(
  connect((state, ownProps) => {
    const { loggerData: logger, appenders }: Object =
      ownProps.resource === 'system'
        ? state.api[ownProps.resource].data
        : state.api[ownProps.resource].data.find(
          (res: Object): boolean => res.id === ownProps.id
        );

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
        async () => {
          const loggerPath = id ? `${id}/logger` : 'logger';

          return del(`${settings.REST_BASE_URL}/${resource}/${loggerPath}`);
        },
        `Removing logger...`,
        `Logger successfuly removed`,
        dispatch
      );
    },
    handleLoggerDuplicateClick: ({
      dispatch,
      resource,
      id,
    }: LoggerContainerProps): Function => (): void => {
      fetchWithNotifications(
        async () =>
          post(
            `${
              settings.REST_BASE_URL
            }/${resource}/${id}/logger?cloneDefault=true`
          ),
        `Duplicating logger...`,
        `Logger successfuly duplicated`,
        dispatch
      );
    },
    handleDeleteAppenderClick: ({
      dispatch,
      resource,
      id,
    }: LoggerContainerProps): Function => (appenderId): void => {
      fetchWithNotifications(
        async () => {
          const appendersPath = id
            ? `${id}/logger/appenders`
            : 'logger/appenders';

          return del(`${settings.REST_BASE_URL}/${resource}/${appendersPath}`, {
            body: JSON.stringify({
              id: appenderId,
            }),
          });
        },
        `Removing appender...`,
        `Appender successfuly removed`,
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
