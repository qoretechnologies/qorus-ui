// @flow
import { Popover, Position } from '@blueprintjs/core';
import size from 'lodash/size';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import ContentByType from '../../components/ContentByType';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import Flex from '../../components/Flex';
import NameColumn, { NameColumnHeader } from '../../components/NameColumn';
import Alert from '../../components/alert';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import Loader from '../../components/loader';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../components/new_table';
import PaneItem from '../../components/pane_item';
import showIfPassed from '../../hocomponents/show-if-passed';
import withDispatch from '../../hocomponents/withDispatch';
import settings from '../../settings';
import { del, fetchWithNotifications } from '../../store/api/utils';
import NewAppenderPopover from './popovers/appender';
import NewLoggerPopover from './popovers/logger';

type LoggerContainerProps = {
  logger: any;
  appenders: Array<Object>;
  id: number;
  resource: string;
  handleLoggerDeleteClick: Function;
  handleDeleteAppenderClick: Function;
  handleLoggerDuplicateClick: Function;
  url: string;
};

const LoggerContainer: Function = ({
  logger,
  appenders,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'isLoggerPopoverOpen' does not exist on t... Remove this comment to see the full error message
  isLoggerPopoverOpen,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'isAppenderPopoverOpen' does not exist on... Remove this comment to see the full error message
  isAppenderPopoverOpen,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'isEditAppenderPopoverOpen' does not exis... Remove this comment to see the full error message
  isEditAppenderPopoverOpen,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'toggleLoggerPopover' does not exist on t... Remove this comment to see the full error message
  toggleLoggerPopover,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'toggleAppenderPopover' does not exist on... Remove this comment to see the full error message
  toggleAppenderPopover,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'toggleEditAppenderPopover' does not exis... Remove this comment to see the full error message
  toggleEditAppenderPopover,
  handleDeleteAppenderClick,
  resource,
  id,
  handleLoggerDeleteClick,
  handleLoggerDuplicateClick,
  url,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
LoggerContainerProps) => (
  <Flex>
    {logger === 'empty' && (
      <Alert bsStyle="danger">
        This interface has no logger defined. Click here to add a default logger, or add a specific
        logger.
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
                usePortal={false}
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
                {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
                <NameColumn name={logger.name} />
                {/* @ts-ignore ts-migrate(2339) FIXME: Property 'level' does not exist on type 'Object'. */}
                <Td>{Object.keys(logger.level)[0]}</Td>
                <Td>
                  {/* @ts-ignore ts-migrate(2339) FIXME: Property 'additivity' does not exist on type 'Obje... Remove this comment to see the full error message */}
                  <ContentByType content={logger.additivity} />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </PaneItem>
        <PaneItem
          title="Appenders"
          label={
            // @ts-ignore ts-migrate(2339) FIXME: Property 'isDefault' does not exist on type 'Objec... Remove this comment to see the full error message
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
                usePortal={false}
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
              {(props: any) => (
                <Tbody {...props}>
                  {appenders.map((appender: any, index: number): any => (
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                    <Tr first={index === 0} key={appender.id}>
                      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
                      <NameColumn name={appender.name} />
                      <Td className="text">
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */}
                        <ContentByType content={appender.type} />
                      </Td>
                      <Td className="text">
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'filename' does not exist on type 'Object... Remove this comment to see the full error message */}
                        <ContentByType content={appender.filename} />
                      </Td>
                      <Td className="text">
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'encoding' does not exist on type 'Object... Remove this comment to see the full error message */}
                        <ContentByType content={appender.encoding} />
                      </Td>
                      <Td className="text">
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'layoutPattern' does not exist on type 'O... Remove this comment to see the full error message */}
                        <ContentByType content={appender.layoutPattern} />
                      </Td>
                      <Td className="narrow">
                        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'rotationCount' does not exist on type 'O... Remove this comment to see the full error message */}
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
                                onCancel={() => toggleEditAppenderPopover(() => false)}
                              />
                            }
                            position={Position.LEFT_TOP}
                            isOpen={isEditAppenderPopoverOpen}
                          >
                            <Button
                              title="Edit appender"
                              icon="edit"
                              stopPropagation
                              onClick={() => toggleEditAppenderPopover(() => true)}
                            />
                          </Popover>
                          <Button
                            title="Remove appender"
                            btnStyle="danger"
                            icon="remove"
                            onClick={() =>
                              // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                              handleDeleteAppenderClick(appender.id)
                            }
                          />
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  ))}
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
    // @ts-ignore ts-migrate(2339) FIXME: Property 'loggerData' does not exist on type 'Obje... Remove this comment to see the full error message
    const { loggerData }: any = state.api[ownProps.resource][
      ownProps.resource === 'system' ? 'logs' : 'data'
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    ].find((res: any): boolean => res.id === ownProps.id);

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
    handleLoggerDeleteClick:
      ({
        // @ts-ignore ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Logger... Remove this comment to see the full error message
        dispatch,
        resource,
        url,
        logger,
        id,
      }: LoggerContainerProps): Function =>
      (): void => {
        fetchWithNotifications(
          async () =>
            del(
              `${settings.REST_BASE_URL}/${url || resource}/${
                // @ts-ignore ts-migrate(2339) FIXME: Property 'toLowerCase' does not exist on type 'nev... Remove this comment to see the full error message
                typeof id === 'string' ? id.toLowerCase() : id
              }/logger`
            ),
          `Removing logger...`,
          `Logger successfuly removed`,
          dispatch
        );
      },
    handleDeleteAppenderClick:
      ({
        // @ts-ignore ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Logger... Remove this comment to see the full error message
        dispatch,
        resource,
        url,
        id,
      }: LoggerContainerProps): Function =>
      (appenderId): void => {
        fetchWithNotifications(
          async () =>
            del(
              `${settings.REST_BASE_URL}/${url || resource}/${
                // @ts-ignore ts-migrate(2339) FIXME: Property 'toLowerCase' does not exist on type 'nev... Remove this comment to see the full error message
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
