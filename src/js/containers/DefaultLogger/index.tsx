// @flow
import { Icon, Popover, Position } from '@blueprintjs/core';
import { useReqore } from '@qoretechnologies/reqore';
import size from 'lodash/size';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import ContentByType from '../../components/ContentByType';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import NameColumn, { NameColumnHeader } from '../../components/NameColumn';
import Alert from '../../components/alert';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../components/new_table';
import PaneItem from '../../components/pane_item';
import withDispatch from '../../hocomponents/withDispatch';
import settings from '../../settings';
import { del, fetchWithNotifications, post } from '../../store/api/utils';
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
  name: string;
  url: string;
};

const DefaultLoggerContainer: Function = ({
  logger,
  appenders,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'isLoggerPopoverOpen' does not exist on t... Remove this comment to see the full error message
  isLoggerPopoverOpen,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'isDefaultLoggerPopoverOpen' does not exi... Remove this comment to see the full error message
  isDefaultLoggerPopoverOpen,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'isLoggerEditPopoverOpen' does not exist ... Remove this comment to see the full error message
  isLoggerEditPopoverOpen,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'isAppenderPopoverOpen' does not exist on... Remove this comment to see the full error message
  isAppenderPopoverOpen,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'isEditAppenderPopoverOpen' does not exis... Remove this comment to see the full error message
  isEditAppenderPopoverOpen,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'toggleLoggerPopover' does not exist on t... Remove this comment to see the full error message
  toggleLoggerPopover,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'toggleDefaultLoggerPopover' does not exi... Remove this comment to see the full error message
  toggleDefaultLoggerPopover,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'toggleLoggerEditPopover' does not exist ... Remove this comment to see the full error message
  toggleLoggerEditPopover,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'toggleAppenderPopover' does not exist on... Remove this comment to see the full error message
  toggleAppenderPopover,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'toggleEditAppenderPopover' does not exis... Remove this comment to see the full error message
  toggleEditAppenderPopover,
  handleDeleteAppenderClick,
  resource,
  id,
  handleLoggerDeleteClick,
  handleLoggerDuplicateClick,
  name,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'defaultOnly' does not exist on type 'Log... Remove this comment to see the full error message
  defaultOnly,
  url,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'LoggerCont... Remove this comment to see the full error message
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
LoggerContainerProps) => {
  const {getAndIncreaseZIndex} = useReqore();
    return (
      <React.Fragment>
        {logger === 'empty' ? (
          <PaneItem
            title={<>
              <Icon icon="info-sign" /> {name || intl.formatMessage({ id: 'component.logger' })}
            </>}
            label={<React.Fragment>
              <Popover
                content={<NewLoggerPopover
                  resource={resource}
                  url={url}
                  onCancel={() => toggleDefaultLoggerPopover(() => false)} />}
                position={Position.BOTTOM}
                isOpen={isDefaultLoggerPopoverOpen}
              >
                <ButtonGroup>
                  <Button
                    text={intl.formatMessage({ id: 'button.add-new-default-logger' })}
                    icon="add"
                    stopPropagation
                    onClick={() => {
                      toggleLoggerPopover(() => false);
                      toggleDefaultLoggerPopover(() => true);
                    } } />
                </ButtonGroup>
              </Popover>
              {!defaultOnly && (
                <Popover
                  content={<NewLoggerPopover
                    resource={resource}
                    url={url}
                    id={id}
                    onCancel={() => toggleLoggerPopover(() => false)} />}
                  isOpen={isLoggerPopoverOpen}
                  position={Position.BOTTOM}
                  usePortal={false}
                >
                  <ButtonGroup>
                    <Button
                      text={intl.formatMessage({ id: 'button.add-new' })}
                      icon="add"
                      stopPropagation
                      onClick={() => {
                        toggleLoggerPopover(() => true);
                        toggleDefaultLoggerPopover(() => false);
                      } } />
                  </ButtonGroup>
                </Popover>
              )}
            </React.Fragment>}
          >
            <Alert bsStyle="danger">
              {intl.formatMessage(
                { id: 'component.no-logger-defined-for-res' },
                { resource: resource }
              )}{' '}
              {!defaultOnly && intl.formatMessage({ id: 'component.no-logger-defined-for-res-2' })}.
            </Alert>
          </PaneItem>
        ) : (
          <React.Fragment>
            <PaneItem
              title={<>
                <Icon icon="info-sign" /> {name || intl.formatMessage({ id: 'component.logger' })}
              </>}
              label={<React.Fragment>
                {!defaultOnly && (
                  <React.Fragment>
                    <Popover
                      content={<NewLoggerPopover
                        resource={resource}
                        url={url}
                        id={id}
                        onCancel={() => toggleLoggerPopover(() => false)} />}
                      isOpen={isLoggerPopoverOpen}
                      position={Position.BOTTOM}
                      usePortal={false}
                    >
                      <ButtonGroup>
                        <Button
                          text={intl.formatMessage({ id: 'button.add-new' })}
                          icon="add"
                          stopPropagation
                          onClick={() => {
                            toggleLoggerPopover(() => true);
                            toggleLoggerEditPopover(() => false);
                          } } />
                      </ButtonGroup>
                    </Popover>
                    <ButtonGroup>
                      <Button
                        text={intl.formatMessage({ id: 'button.clone-logger' })}
                        icon="duplicate"
                        stopPropagation
                        onClick={handleLoggerDuplicateClick} />
                    </ButtonGroup>
                  </React.Fragment>
                )}
                <Popover
                  content={<NewLoggerPopover
                    resource={resource}
                    url={url}
                    id={id}
                    data={logger}
                    onCancel={() => toggleLoggerEditPopover(() => false)} />}
                  isOpen={isLoggerEditPopoverOpen}
                  usePortal={false}
                >
                  <ButtonGroup>
                    <Button
                      text={intl.formatMessage({ id: 'button.edit' })}
                      icon="edit"
                      stopPropagation
                      onClick={() => {
                        toggleLoggerEditPopover(() => true);
                        toggleLoggerPopover(() => false);
                      } } />
                  </ButtonGroup>
                </Popover>
                <ButtonGroup>
                  <Button
                    text={intl.formatMessage({ id: 'button.delete' })}
                    btnStyle="danger"
                    icon="remove"
                    onClick={handleLoggerDeleteClick} />
                </ButtonGroup>
              </React.Fragment>}
            >
              {!defaultOnly && (
                <Alert bsStyle="warning">
                  <FormattedMessage id="component.interface-using-def-logger" />
                </Alert>
              )}
              <Table fixed striped>
                <Thead>
                  <FixedRow>
                    <NameColumnHeader />
                    <Th icon="info-sign">
                      <FormattedMessage id="logger.level" />
                    </Th>
                    <Th icon="info-sign">
                      <FormattedMessage id="logger.additivity" />
                    </Th>
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
            <br />
            <PaneItem
              title={<>
                <Icon icon="info-sign" /> <FormattedMessage id="component.appenders" />
              </>}
              label={<Popover
                content={<NewAppenderPopover
                  resource={resource}
                  url={url}
                  id={id}
                  onCancel={() => toggleAppenderPopover(() => false)} />}
                position={Position.LEFT_TOP}
                usePortal={false}
                isOpen={isAppenderPopoverOpen}
              >
                <Button
                  text={intl.formatMessage({ id: 'button.add-new' })}
                  icon="add"
                  stopPropagation
                  onClick={() => toggleAppenderPopover(() => true)} />
              </Popover>}
            >
              <Table fixed condensed striped>
                <Thead>
                  <FixedRow>
                    <NameColumnHeader />
                    <Th className="text" icon="info-sign">
                      <FormattedMessage id="table.type" />
                    </Th>
                    <Th className="text" icon="info-sign">
                      <FormattedMessage id="logger.filename" />
                    </Th>
                    <Th className="text" icon="info-sign">
                      <FormattedMessage id="logger.encoding" />
                    </Th>
                    <Th className="text" icon="info-sign">
                      <FormattedMessage id="logger.layout-pattern" />
                    </Th>
                    <Th icon="refresh" title={intl.formatMessage({ id: 'logger.rotation-count' })} />
                    <Th icon="wrench" title={intl.formatMessage({ id: 'table.actions' })} />
                  </FixedRow>
                </Thead>
                <DataOrEmptyTable condition={size(appenders) === 0} cols={7} small>
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
                                content={<NewAppenderPopover
                                  resource={resource}
                                  url={url}
                                  id={id}
                                  data={appender}
                                  onCancel={() => toggleEditAppenderPopover(() => false)} />}
                                position={Position.LEFT_TOP}
                                isOpen={isEditAppenderPopoverOpen}
                                usePortal={false}
                              >
                                <Button
                                  title={intl.formatMessage({ id: 'button.edit' })}
                                  icon="edit"
                                  stopPropagation
                                  onClick={() => toggleEditAppenderPopover(() => true)} />
                              </Popover>
                              <Button
                                title={intl.formatMessage({ id: 'button.remove-appender' })}
                                btnStyle="danger"
                                icon="remove"
                                onClick={() =>
                                  // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                                  handleDeleteAppenderClick(appender.id)} />
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
      </React.Fragment>
    );
  };

export default compose(
  connect((state, ownProps) => {
    let {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'loggerData' does not exist on type 'Obje... Remove this comment to see the full error message
      loggerData: { logger, appenders },
    }: any = state.api.system.data.defaultLoggers[ownProps.resource];

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
          async () => del(`${settings.REST_BASE_URL}/${url || resource}?action=defaultLogger`),
          `Removing logger...`,
          `Logger successfuly removed`,
          dispatch
        );
      },
    handleLoggerDuplicateClick:
      ({
        // @ts-ignore ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Logger... Remove this comment to see the full error message
        dispatch,
        resource,
        url,
        id,
      }: LoggerContainerProps): Function =>
      (): void => {
        fetchWithNotifications(
          async () =>
            post(
              `${settings.REST_BASE_URL}/${url || resource}/${
                // @ts-ignore ts-migrate(2339) FIXME: Property 'toLowerCase' does not exist on type 'nev... Remove this comment to see the full error message
                typeof id === 'string' ? id.toLowerCase() : id
              }/logger?cloneDefault=true`
            ),
          `Duplicating logger...`,
          `Logger successfuly duplicated`,
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
            del(`${settings.REST_BASE_URL}/${url || resource}?action=defaultLoggerAppenders`, {
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
    'update',
    'logger',
    'appenders',
    'isLoggerPopoverOpen',
    'isDefaultLoggerPopoverOpen',
    'isLoggerEditPopoverOpen',
    'isAppenderPopoverOpen',
    'isEditAppenderPopoverOpen',
  ]),
  injectIntl
)(DefaultLoggerContainer);
