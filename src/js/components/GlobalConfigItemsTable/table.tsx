// @flow
import { ReqoreCollection, ReqorePanel, ReqoreTag, ReqoreTagGroup } from '@qoretechnologies/reqore';
import { IReqoreCollectionItemProps } from '@qoretechnologies/reqore/dist/components/Collection/item';
import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import ConfigItemsModal from '../ConfigItemsTable/modal';
import { Value } from '../ConfigItemsTable/table';

type ConfigItemsTableProps = {
  items: any;
  dispatchAction: Function;
  openModal: Function;
  closeModal: Function;
  saveValue: Function;
  intrf: string;
  belongsTo: string;
  showDescription: boolean;
  globalItems: any;
};

const ConfigItemsTable: Function = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'configItems' does not exist on type 'Con... Remove this comment to see the full error message
  configItems,
  belongsTo,
  openModal,
  closeModal,
  saveValue,
  intrf,
  showDescription,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleToggleDescription' does not exist ... Remove this comment to see the full error message
  handleToggleDescription,
  dispatchAction,
  globalItems,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'ConfigItem... Remove this comment to see the full error message
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ConfigItemsTableProps) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreatingNewItem, setIsCreatingNewItem] = useState(false);

  return (
    <React.Fragment>
      {selectedItem && (
        <ConfigItemsModal
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          onSubmit={saveValue}
          intrf={intrf}
          isGlobal
        />
      )}
      {isCreatingNewItem && (
        <ConfigItemsModal
          onClose={() => setIsCreatingNewItem(false)}
          onSubmit={saveValue}
          intrf={intrf}
          isGlobal
          globalConfig={globalItems}
        />
      )}
      <ReqoreCollection
        filterable
        sortable
        customTheme={{
          main: '#7c7c7c',
        }}
        actions={[
          {
            icon: 'AddFill',
            label: 'Add new',
            onClick: () => {
              setIsCreatingNewItem(true);
            },
          },
        ]}
        maxItemHeight={200}
        items={configItems.data.map(
          (configItem): IReqoreCollectionItemProps => ({
            label: configItem.name,
            headerSize: 3,
            icon: 'PriceTag3Line',
            customTheme: {
              main: '#ececec',
            },
            actions: [
              {
                icon: 'DeleteBinLine',
                intent: 'danger',
                minimal: true,
                onClick: () => {
                  dispatchAction(
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
                    actions.system.deleteConfigItem,
                    null,
                    null,
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    configItem.name,
                    null
                  );
                },
              },
            ],
            tooltip: {
              opaque: true,
              delay: 300,
              content: (
                <ReqorePanel
                  label={configItem.name}
                  headerSize={3}
                  icon="InformationLine"
                  customTheme={{ main: '#e4e8ef' }}
                >
                  <ReactMarkdown>{configItem.desc}</ReactMarkdown>
                  <ReqoreTagGroup>
                    <ReqoreTag
                      labelKey="Strictly Local"
                      rightIcon={configItem.strictly_local ? 'CheckLine' : 'CloseLine'}
                      intent="info"
                    />
                  </ReqoreTagGroup>
                </ReqorePanel>
              ),
            },
            onClick: () => setSelectedItem(configItem),
            content: <Value item={configItem} />,
            tags: [
              {
                label: configItem.type,
                icon: 'CodeLine',
                intent: 'info',
                rightIcon: '24HoursFill',
              },
            ],
          })
        )}
      />
    </React.Fragment>
  );
};

export default compose(
  withDispatch(),
  onlyUpdateForKeys(['configItems', 'showDescription', 'globalConfig']),
  injectIntl
)(ConfigItemsTable);
