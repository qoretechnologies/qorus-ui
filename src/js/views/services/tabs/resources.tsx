// @flow
import {
  ReqoreCollection,
  ReqoreMessage,
  ReqoreTable,
  ReqoreTabs,
  ReqoreTabsContent,
  ReqoreTree,
  useReqoreProperty,
} from '@qoretechnologies/reqore';
import map from 'lodash/map';
import size from 'lodash/size';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import ResourceFileModal from './modals/resourceFile';

type Props = {
  resources: any;
  resourceFiles: { name: string; type: string }[];
  openModal: Function;
  closeModal: Function;
  id: number;
};

const ResourceTable: Function = ({ resources, resourceFiles = [], id }: Props) => {
  const addModal = useReqoreProperty('addModal');

  return (
    <ReqoreTabs
      fillParent
      padded={false}
      tabsPadding="vertical"
      activeTab="resources"
      tabs={[
        { id: 'resources', label: 'Resources', badge: size(resources) },
        { id: 'resourcefiles', label: 'Resource Files', badge: size(resourceFiles) },
      ]}
    >
      <ReqoreTabsContent tabId="resources">
        <ReqoreCollection
          fill
          size="small"
          filterable
          maxItemHeight={200}
          sortable
          zoomable
          items={map(resources, (resource, name) => ({
            icon: 'DragMoveFill',
            label: name,
            badge: resource.type,
            size: 'small',
            flat: false,
            expandable: true,
            minimal: false,
            content: `${resource.desc}`,
            expandedContent: (
              <>
                <ReqoreMessage margin="bottom" size="small">
                  {resource.desc}
                </ReqoreMessage>
                <ReqoreTree
                  label="Resource info"
                  responsiveTitle={false}
                  responsiveActions={false}
                  exportable
                  zoomable
                  data={resource.info}
                  size="small"
                />
              </>
            ),
          }))}
        />
      </ReqoreTabsContent>
      {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; suffix: a... Remove this comment to see the full error message */}
      <ReqoreTabsContent tabId="resourcefiles">
        <ReqoreTable
          label="Resource files"
          striped
          onRowClick={({ name }) => {
            addModal(<ResourceFileModal id={id} name={name} />);
          }}
          columns={[
            {
              dataId: 'name',
              header: {
                label: 'Name',
                icon: 'PriceTag2Line',
              },
              grow: 2,
              sortable: true,
            },
            {
              dataId: 'typedesc',
              header: {
                label: 'Type',
              },
              width: 150,
              sortable: true,
            },
            {
              dataId: 'mimetype',
              header: {
                label: 'MIME type',
              },
              width: 150,
              grow: 1,
              cell: {
                content: 'tag',
              },
              sortable: true,
            },
            {
              dataId: 'actions',
              align: 'center',
              header: {
                icon: 'SettingsLine',
              },
              pin: 'right',
              cell: {
                padded: 'none',
                actions: ({ name  }) => [
                  {
                    icon: 'File3Line',
                    tooltip: 'Show file contents',
                    onClick: () => {
                      addModal(<ResourceFileModal id={id} name={name} />);
                    },
                  },
                ],
              },
            },
          ]}
          data={resourceFiles}
          exportable
          filterable
        />
      </ReqoreTabsContent>
    </ReqoreTabs>
  );
};

export default compose(pure(['resources', 'resourceFiles']), injectIntl)(ResourceTable);
