// @flow
import {
  ReqoreButton,
  ReqoreColumn,
  ReqoreColumns,
  ReqoreControlGroup,
  ReqoreIcon,
  ReqoreMessage,
  ReqoreModal,
  ReqoreTable,
  ReqoreTag,
  ReqoreTree,
} from '@qoretechnologies/reqore';
import isArray from 'lodash/isArray';
import isNull from 'lodash/isNull';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import size from 'lodash/size';
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { sortDefaults } from '../../constants/sort';
import { COLORS } from '../../constants/ui';
import Search from '../../containers/search';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import ContentByType from '../ContentByType';
import type { EnhancedTableProps } from '../EnhancedTable';
import EnhancedTable from '../EnhancedTable';
import { getTypeFromValue, maybeParseYaml } from '../Field/validations';
import Spacer from '../Spacer';
import ConfigItemsModal from './modal';

type ConfigItemsTableProps = {
  items: any;
  dispatchAction: Function;
  // @ts-ignore ts-migrate(2300) FIXME: Duplicate identifier 'intrf'.
  intrf: string;
  openModal: Function;
  closeModal: Function;
  saveValue: Function;
  // @ts-ignore ts-migrate(2300) FIXME: Duplicate identifier 'intrf'.
  intrf: string;
  belongsTo: string;
  showDescription: boolean;
  levelType: string;
  stepId?: number;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const ConfigItemsTable: Function = (props: ConfigItemsTableProps) => (
  <React.Fragment>
    {/* @ts-ignore ts-migrate(2339) FIXME: Property 'isGrouped' does not exist on type 'Confi... Remove this comment to see the full error message */}
    {props.isGrouped && size(props.data) ? (
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'ConfigItem... Remove this comment to see the full error message
      map(props.data, (configItemsData, groupName) => (
        <>
          <br />
          <ItemsTable
            {...props}
            groupName={groupName}
            configItemsData={configItemsData}
            title={groupName}
          />
          <br />
        </>
      ))
    ) : (
      // @ts-ignore ts-migrate(2339) FIXME: Property 'configItems' does not exist on type 'Con... Remove this comment to see the full error message
      <ItemsTable {...props} configItemsData={props.configItems.data} />
    )}
  </React.Fragment>
);

export const getItemType = (type, value) => {
  if (type === 'any' || type === 'auto') {
    return getTypeFromValue(maybeParseYaml(value));
  }

  return type.replace('*', '');
};

export const Value = ({ item, useDefault }: any) => {
  const [showValue, setShowValue] = useState(!item.sensitive);
  const [hideTimer, setHideTimer] = useState(null);

  useEffect(() => {
    setShowValue(!item.sensitive);
  }, [item.sensitive]);

  useEffect(() => {
    return () => {
      clearTimeout(hideTimer);
    };
  }, [hideTimer]);

  const value = useDefault ? item.default_value : item.value;
  const yamlValue = useDefault ? item.yamlData?.default_value : item.yamlData?.value;

  if (!showValue) {
    return (
      <div
        onClick={() => {
          setHideTimer(() => {
            return setTimeout(() => {
              setShowValue(false);
            }, 30000);
          });
          setShowValue(true);
        }}
        style={{
          position: 'absolute',
          width: '70%',
          top: '5px',
          bottom: '5px',
          left: '5px',
          backgroundColor: '#000',
          cursor: 'pointer',
          color: '#fff',
          textAlign: 'center',
          verticalAlign: 'middle',
        }}
      >
        {' '}
        Click to reveal{' '}
      </div>
    );
  }

  if (isUndefined(value)) {
    return <span> - </span>;
  }
  if (isNull(value)) {
    return <span> null </span>;
  }
  if (item.isTemplatedString) {
    return <ContentByType inTable content={value} />;
  }

  const type =
    item.type === 'auto' || item.type === 'any'
      ? item.value_true_type || getItemType(item.type, yamlValue)
      : item.type;

  if (isObject(item.value) || isArray(item.value) || type === 'hash' || type === 'list') {
    // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
    return <ReqoreTree compact data={item.value} />;
  }

  return <ContentByType inTable content={item.value} noMarkdown baseType={type} />;
};

let ItemsTable: any = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'configItems' does not exist on type 'Con... Remove this comment to see the full error message
  configItems,
  belongsTo,
  openModal,
  closeModal,
  saveValue,
  intrf,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intrfId' does not exist on type 'ConfigI... Remove this comment to see the full error message
  intrfId,
  showDescription,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleToggleDescription' does not exist ... Remove this comment to see the full error message
  handleToggleDescription,
  dispatchAction,
  levelType,
  stepId,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'configItemsData' does not exist on type ... Remove this comment to see the full error message
  configItemsData,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'title' does not exist on type 'ConfigIte... Remove this comment to see the full error message
  title,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'groupName' does not exist on type 'Confi... Remove this comment to see the full error message
  groupName,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'ConfigItem... Remove this comment to see the full error message
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ConfigItemsTableProps) => {
  const [inspectValue, setInspectValue] = useState(null);

  return (
    <React.Fragment>
      {inspectValue && (
        <ReqoreModal isOpen onClose={() => setInspectValue(null)} width="50vw">
          <Value item={inspectValue} />
        </ReqoreModal>
      )}
      <EnhancedTable
        collection={configItemsData}
        searchBy={['name', 'default_value', 'value', 'type', 'desc']}
        tableId={belongsTo}
        sortDefault={sortDefaults.configItems}
      >
        {({
          collection,
          canLoadMore,
          handleLoadMore,
          handleLoadAll,
          loadMoreTotal,
          loadMoreCurrent,
          limit,
          sortData,
          onSortChange,
          handleSearchChange,
        }: EnhancedTableProps) => (
          <>
            <ReqoreColumns>
              <ReqoreColumn>{groupName && <ReqoreTag label={groupName} />}</ReqoreColumn>
              <ReqoreColumn justifyContent="flex-end">
                <Search onSearchUpdate={handleSearchChange} resource="configItems" />
              </ReqoreColumn>
            </ReqoreColumns>
            <Spacer size={10} />
            {!size(collection) ? (
              <ReqoreMessage intent="warning" flat inverted>
                There are no config items for this interface{' '}
              </ReqoreMessage>
            ) : null}
            {size(collection) ? (
              <>
                <ReqoreTable
                  style={{ flexShrink: 0 }}
                  height={size(collection) * 45}
                  rounded
                  striped
                  columns={[
                    {
                      dataId: 'name',
                      header: intl.formatMessage({ id: 'table.name' }),
                      sortable: true,
                      grow: 2,
                      width: 300,
                    },
                    {
                      dataId: 'desc',
                      header: intl.formatMessage({ id: 'table.description' }),
                      sortable: true,
                      cellTooltip(data) {
                        return data.desc;
                      },
                      width: 500,
                    },
                    {
                      dataId: 'value',
                      header: intl.formatMessage({ id: 'table.value' }),
                      sortable: true,
                      width: 240,
                      onCellClick(data) {
                        setInspectValue(data);
                      },
                      content: (item) =>
                        isObject(item.value) || isArray(item.value) ? (
                          <ReqoreTag label="Complex value; click here to show" size="small" />
                        ) : (
                          <Value item={item} />
                        ),
                    },
                    {
                      dataId: 'strictly_local',
                      header: intl.formatMessage({ id: 'table.local' }),
                      sortable: true,
                      align: 'center',
                      width: 100,
                      content: ({ strictly_local }) =>
                        strictly_local ? (
                          <ReqoreIcon icon="CheckLine" color={COLORS.green} />
                        ) : (
                          <ReqoreIcon icon="CloseLine" color={COLORS.danger} />
                        ),
                    },
                    {
                      dataId: 'level',
                      header: intl.formatMessage({ id: 'table.level' }),
                      sortable: true,
                      align: 'center',
                      width: 200,
                      content: ({ level }) => <ReqoreTag label={level} size="small" />,
                    },
                    {
                      dataId: 'type',
                      header: intl.formatMessage({ id: 'table.type' }),
                      icon: 'CodeFill',
                      sortable: true,
                      align: 'center',
                      width: 100,
                      content: ({ type }) => <ReqoreTag label={`<${type} />`} size="small" />,
                    },
                    {
                      dataId: 'actions',
                      header: intl.formatMessage({ id: 'table.actions' }),
                      align: 'center',
                      width: 100,
                      sortable: false,
                      content: (item) => (
                        <ReqoreControlGroup stack>
                          <ReqoreButton
                            flat
                            icon="Edit2Line"
                            onClick={() => {
                              openModal(
                                <ConfigItemsModal
                                  onClose={closeModal}
                                  item={{ ...item }}
                                  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                                  belongsTo={belongsTo}
                                  onSubmit={saveValue}
                                  intrf={intrf}
                                  intrfId={configItems.id || intrfId}
                                  stepId={configItems.stepId || stepId}
                                  levelType={levelType}
                                />
                              );
                            }}
                          />

                          <ReqoreButton
                            flat
                            icon="CloseLine"
                            disabled={item.level ? !item.level.startsWith(levelType || '') : true}
                            intent="warning"
                            onClick={() => {
                              dispatchAction(
                                actions[intrf].deleteConfigItem,
                                configItems.id || intrfId,
                                configItems.stepId || stepId,
                                // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                                item.name,
                                null
                              );
                            }}
                          />
                        </ReqoreControlGroup>
                      ),
                    },
                  ]}
                  sort={{
                    by: 'name',
                  }}
                  data={collection}
                />
              </>
            ) : null}
          </>
        )}
      </EnhancedTable>
    </React.Fragment>
  );
};

ItemsTable = compose(
  withState('showDescription', 'toggleDescription', false),
  withHandlers({
    handleToggleDescription:
      ({ toggleDescription }) =>
      () => {
        toggleDescription((value) => !value);
      },
  }),
  injectIntl
)(ItemsTable);

export default compose(
  withDispatch(),
  mapProps(({ configItems, ...rest }) => ({
    data: reduce(
      configItems.data,
      (newItems, item, itemName) => {
        // Check if this group exists
        if (!newItems[item.config_group]) {
          newItems[item.config_group] = [];
        }
        // Push the item
        newItems[item.config_group].push(item);
        return newItems;
      },
      {}
    ),
    configItems,
    ...rest,
  })),
  onlyUpdateForKeys(['configItems', 'showDescription', 'isGrouped'])
)(ConfigItemsTable);
