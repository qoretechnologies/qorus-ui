// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import Flex from '../../components/Flex';
import withDispatch from '../../hocomponents/withDispatch';
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
import { Popover, Position } from '@blueprintjs/core';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { fetchWithNotifications, del, post } from '../../store/api/utils';
import settings from '../../settings';
import Alert from '../../components/alert';

type LoggerContainerProps = {
  logger: Object,
  appenders: Array<Object>,
  id: number,
  resource: string,
  handleLoggerDeleteClick: Function,
  handleDeleteAppenderClick: Function,
  handleLoggerDuplicateClick: Function,
  name: string,
  url: string,
};

const DefaultLoggerContainer: Function = ({
  logger,
  appenders,
  isLoggerPopoverOpen,
  isDefaultLoggerPopoverOpen,
  isLoggerEditPopoverOpen,
  isAppenderPopoverOpen,
  isEditAppenderPopoverOpen,
  toggleLoggerPopover,
  toggleDefaultLoggerPopover,
  toggleLoggerEditPopover,
  toggleAppenderPopover,
  toggleEditAppenderPopover,
  handleDeleteAppenderClick,
  resource,
  id,
  handleLoggerDeleteClick,
  handleLoggerDuplicateClick,
  name: name = 'Logger',
  defaultOnly,
  url,
}: LoggerContainerProps): React.Element<any> => (
  <React.Fragment>
    {logger === 'empty' ? (
      <PaneItem
        title={name}
        label={
          <React.Fragment>
            <Popover
              content={
                <NewLoggerPopover
                  resource={resource}
                  url={url}
                  onCancel={() => toggleDefaultLoggerPopover(() => false)}
                />
              }
              position={Position.LEFT_TOP}
              isOpen={isDefaultLoggerPopoverOpen}
            >
              <ButtonGroup>
                <Button
                  text="Add new default logger"
                  icon="add"
                  stopPropagation
                  onClick={() => {
                    toggleLoggerPopover(() => false);
                    toggleDefaultLoggerPopover(() => true);
                  }}
                />
              </ButtonGroup>
            </Popover>
            {!defaultOnly && (
              <Popover
                content={
                  <NewLoggerPopover
                    resource={resource}
                    url={url}
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
                    onClick={() => {
                      toggleLoggerPopover(() => true);
                      toggleDefaultLoggerPopover(() => false);
                    }}
                  />
                </ButtonGroup>
              </Popover>
            )}
          </React.Fragment>
        }
      >
        <Alert bsStyle="danger">
          There is no logger defined for {resource}. Use the buttons above to
          create a default logger{' '}
          {!defaultOnly && 'or concrete loggers for this interface'}.
        </Alert>
      </PaneItem>
    ) : (
      <React.Fragment>
        <PaneItem
          title={name}
          label={
            <React.Fragment>
              {!defaultOnly && (
                <React.Fragment>
                  <Popover
                    content={
                      <NewLoggerPopover
                        resource={resource}
                        url={url}
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
                        onClick={() => {
                          toggleLoggerPopover(() => true);
                          toggleLoggerEditPopover(() => false);
                        }}
                      />
                    </ButtonGroup>
                  </Popover>
                  <ButtonGroup>
                    <Button
                      text="Clone logger"
                      icon="duplicate"
                      stopPropagation
                      onClick={handleLoggerDuplicateClick}
                    />
                  </ButtonGroup>
                </React.Fragment>
              )}
              <Popover
                content={
                  <NewLoggerPopover
                    resource={resource}
                    url={url}
                    id={id}
                    data={logger}
                    onCancel={() => toggleLoggerEditPopover(() => false)}
                  />
                }
                position={Position.LEFT_TOP}
                isOpen={isLoggerEditPopoverOpen}
              >
                <ButtonGroup>
                  <Button
                    text="Edit logger"
                    icon="edit"
                    stopPropagation
                    onClick={() => {
                      toggleLoggerEditPopover(() => true);
                      toggleLoggerPopover(() => false);
                    }}
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
          }
        >
          {!defaultOnly && (
            <Alert bsStyle="warning">
              This interface is using default logger.
            </Alert>
          )}
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
          title={`${name} Appenders`}
          label={
            <Popover
              content={
                <NewAppenderPopover
                  resource={resource}
                  url={url}
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
                <Th icon="remove" title="Remove appender" />
              </FixedRow>
            </Thead>
            <DataOrEmptyTable condition={size(appenders) === 0} cols={7} small>
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
                        <Td className="narrow">
                          <ButtonGroup>
                            <Popover
                              content={
                                <NewAppenderPopover
                                  resource={resource}
                                  url={url}
                                  id={id}
                                  data={appender}
                                  onCancel={() =>
                                    toggleEditAppenderPopover(() => false)
                                  }
                                />
                              }
                              position={Position.LEFT_TOP}
                              isOpen={isEditAppenderPopoverOpen}
                            >
                              <Button
                                title="Edit appender"
                                icon="edit"
                                stopPropagation
                                onClick={() =>
                                  toggleEditAppenderPopover(() => true)
                                }
                              />
                            </Popover>
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
                      </Tr>
                    )
                  )}
                </Tbody>
              )}
            </DataOrEmptyTable>
          </Table>
        </PaneItem>
      </React.Fragment>
    )}
  </React.Fragment>
);

export default compose(
  connect((state, ownProps) => {
    let {
      loggerData: { logger, appenders },
    }: Object = state.api.system.data.defaultLoggers[ownProps.resource];

    return {
      update: Date.now(),
      logger,
      appenders,
    };
  }),
  withDispatch(),
  withState('isLoggerPopoverOpen', 'toggleLoggerPopover', false),
  withState('isDefaultLoggerPopoverOpen', 'toggleDefaultLoggerPopover', false),
  withState('isLoggerEditPopoverOpen', 'toggleLoggerEditPopover', false),
  withState('isAppenderPopoverOpen', 'toggleAppenderPopover', false),
  withState('isEditAppenderPopoverOpen', 'toggleEditAppenderPopover', false),
  withHandlers({
    handleLoggerDeleteClick: ({
      dispatch,
      resource,
      url,
      logger,
      id,
    }: LoggerContainerProps): Function => (): void => {
      fetchWithNotifications(
        async () =>
          del(
            `${settings.REST_BASE_URL}/${url || resource}?action=defaultLogger`
          ),
        `Removing logger...`,
        `Logger successfuly removed`,
        dispatch
      );
    },
    handleLoggerDuplicateClick: ({
      dispatch,
      resource,
      url,
      id,
    }: LoggerContainerProps): Function => (): void => {
      fetchWithNotifications(
        async () =>
          post(
            `${settings.REST_BASE_URL}/${url ||
              resource}/${id.toLowerCase()}/logger?cloneDefault=true`
          ),
        `Duplicating logger...`,
        `Logger successfuly duplicated`,
        dispatch
      );
    },
    handleDeleteAppenderClick: ({
      dispatch,
      resource,
      url,
      id,
    }: LoggerContainerProps): Function => (appenderId): void => {
      fetchWithNotifications(
        async () =>
          del(
            `${settings.REST_BASE_URL}/${url ||
              resource}?action=defaultLoggerAppenders`,
            {
              body: JSON.stringify({
                id: appenderId,
              }),
            }
          ),
        `Removing appender...`,
        `Appender successfuly removed`,
        dispatch
      );
    },
  }),
  onlyUpdateForKeys([
    'update',
    'logger',
    'appenders',
    'isLoggerPopoverOpen',
    'isDefaultLoggerPopoverOpen',
    'isLoggerEditPopoverOpen',
    'isAppenderPopoverOpen',
    'isEditAppenderPopoverOpen',
  ])
)(DefaultLoggerContainer);
