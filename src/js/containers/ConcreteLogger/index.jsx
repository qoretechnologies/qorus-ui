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
    {logger === 'empty' && (
      <Alert bsStyle="danger">
        This interface has no logger defined. Click here to add a default
        logger, or add a specific logger.
      </Alert>
    )}
    {logger !== 'empty' && (
      <React.Fragment>
        <PaneItem
          title="Logger"
          label={
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
  </Flex>
);

export default compose(
  connect((state, ownProps) => {
    console.log(ownProps);
    let { loggerData }: Object = state.api[ownProps.resource][
      ownProps.resource === 'system' ? 'logs' : 'data'
    ].find((res: Object): boolean => res.id === ownProps.id);

    console.log(loggerData);

    return {
      ...loggerData,
    };
  }),
  showIfPassed(({ logger }) => logger, <Loader />),
  withDispatch(),
  withState('isLoggerPopoverOpen', 'toggleLoggerPopover', false),
  withState('isAppenderPopoverOpen', 'toggleAppenderPopover', false),
  withHandlers({
    handleLoggerDeleteClick: ({
      dispatch,
      resource,
      logger,
      id,
    }: LoggerContainerProps): Function => (): void => {
      fetchWithNotifications(
        async () => del(`${settings.REST_BASE_URL}/${resource}/${id}/logger`),
        `Removing logger...`,
        `Logger successfuly removed`,
        dispatch
      );
    },
    handleDeleteAppenderClick: ({
      dispatch,
      resource,
      id,
    }: LoggerContainerProps): Function => (appenderId): void => {
      fetchWithNotifications(
        async () =>
          del(`${settings.REST_BASE_URL}/${resource}/${id}/logger/appenders`, {
            body: JSON.stringify({
              id: appenderId,
            }),
          }),
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
