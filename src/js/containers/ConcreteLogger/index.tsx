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
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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
  url: string,
};

const LoggerContainer: Function = ({
  logger,
  appenders,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'isLoggerPopoverOpen' does not exist on t... Remove this comment to see the full error message
  isLoggerPopoverOpen,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'isAppenderPopoverOpen' does not exist on... Remove this comment to see the full error message
  isAppenderPopoverOpen,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'isEditAppenderPopoverOpen' does not exis... Remove this comment to see the full error message
  isEditAppenderPopoverOpen,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'toggleLoggerPopover' does not exist on t... Remove this comment to see the full error message
  toggleLoggerPopover,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'toggleAppenderPopover' does not exist on... Remove this comment to see the full error message
  toggleAppenderPopover,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'toggleEditAppenderPopover' does not exis... Remove this comment to see the full error message
  toggleEditAppenderPopover,
  handleDeleteAppenderClick,
  resource,
  id,
  handleLoggerDeleteClick,
  handleLoggerDuplicateClick,
  url,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
                    url={url}
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
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                <NameColumn name={logger.name} />
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'level' does not exist on type 'Object'.
                <Td>{Object.keys(logger.level)[0]}</Td>
                <Td>
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'additivity' does not exist on type 'Obje... Remove this comment to see the full error message
                  <ContentByType content={logger.additivity} />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </PaneItem>
        <PaneItem
          title="Appenders"
          label={
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'isDefault' does not exist on type 'Objec... Remove this comment to see the full error message
            !logger.isDefault && (
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
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                      <Tr first={index === 0} key={appender.id}>
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                        <NameColumn name={appender.name} />
                        <Td className="text">
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
                          <ContentByType content={appender.type} />
                        </Td>
                        <Td className="text">
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'filename' does not exist on type 'Object... Remove this comment to see the full error message
                          <ContentByType content={appender.filename} />
                        </Td>
                        <Td className="text">
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'encoding' does not exist on type 'Object... Remove this comment to see the full error message
                          <ContentByType content={appender.encoding} />
                        </Td>
                        <Td className="text">
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'layoutPattern' does not exist on type 'O... Remove this comment to see the full error message
                          <ContentByType content={appender.layoutPattern} />
                        </Td>
                        <Td className="narrow">
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'rotationCount' does not exist on type 'O... Remove this comment to see the full error message
                          <ContentByType content={appender.rotationCount} />
                        </Td>
                        <Td className="narrow">
                          <ButtonGroup>
                            <Popover
                              content={
                                <NewAppenderPopover
                                  resource={resource}
                                  id={id}
                                  url={url}
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
                                // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'loggerData' does not exist on type 'Obje... Remove this comment to see the full error message
    const { loggerData }: Object = state.api[ownProps.resource][
      ownProps.resource === 'system' ? 'logs' : 'data'
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    ].find((res: Object): boolean => res.id === ownProps.id);

    return {
      update: Date.now(),
      ...loggerData,
    };
  }),
  showIfPassed(({ logger }) => logger, <Loader />),
  withDispatch(),
  withState('isLoggerPopoverOpen', 'toggleLoggerPopover', false),
  withState('isAppenderPopoverOpen', 'toggleAppenderPopover', false),
  withState('isEditAppenderPopoverOpen', 'toggleEditAppenderPopover', false),
  withHandlers({
    handleLoggerDeleteClick: ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Logger... Remove this comment to see the full error message
      dispatch,
      resource,
      url,
      logger,
      id,
    }: LoggerContainerProps): Function => (): void => {
      fetchWithNotifications(
        async () =>
          del(
            `${settings.REST_BASE_URL}/${url || resource}/${
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'toLowerCase' does not exist on type 'nev... Remove this comment to see the full error message
              typeof id === 'string' ? id.toLowerCase() : id
            }/logger`
          ),
        `Removing logger...`,
        `Logger successfuly removed`,
        dispatch
      );
    },
    handleDeleteAppenderClick: ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Logger... Remove this comment to see the full error message
      dispatch,
      resource,
      url,
      id,
    }: LoggerContainerProps): Function => (appenderId): void => {
      fetchWithNotifications(
        async () =>
          del(
            `${settings.REST_BASE_URL}/${url || resource}/${
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'toLowerCase' does not exist on type 'nev... Remove this comment to see the full error message
              typeof id === 'string' ? id.toLowerCase() : id
            }/logger/appenders`,
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
    'isAppenderPopoverOpen',
    'isEditAppenderPopoverOpen',
  ])
)(LoggerContainer);
