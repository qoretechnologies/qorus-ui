// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import {
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../../../components/new_table';
import Text from '../../../components/text';
import Tabs, { Pane } from '../../../components/tabs';
import NoDataIf from '../../../components/NoDataIf';

type Props = {
  resources: Object,
  resourceFiles: Array<Object>,
};

const ResourceTable: Function = ({
  resources,
  resourceFiles,
}: Props): React.Element<any> => (
  <Tabs active="resources">
    <Pane name="Resources">
      <NoDataIf condition={!resources || size(resources) === 0} big>
        {() => (
          <Table fixed condensed striped>
            <Thead>
              <FixedRow>
                <Th className="name">Name</Th>
                <Th className="text">Description</Th>
                <Th className="text">Info</Th>
                <Th className="text">Type</Th>
              </FixedRow>
            </Thead>
            <Tbody>
              {Object.keys(resources).map(
                (resource: string, key: number): React.Element<any> => (
                  <Tr
                    key={key}
                    first={key === 0}
                    observeElement={key === 0 ? '.pane' : undefined}
                  >
                    <Td className="name">
                      <Text text={resource} />
                    </Td>
                    <Td className="text">
                      <Text text={resources[resource].desc} />
                    </Td>
                    <Td className="text">
                      <Text text={resources[resource].type} />
                    </Td>
                    <Td className="text">
                      <a>
                        <Text
                          popup
                          placeholder="Show info"
                          text={resources[resource].info}
                          renderTree
                        />
                      </a>
                    </Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        )}
      </NoDataIf>
    </Pane>
    <Pane name="Resource files">
      <NoDataIf condition={!resourceFiles || resourceFiles.length === 0} big>
        {() => (
          <Table fixed condensed striped>
            <Thead>
              <FixedRow>
                <Th className="name">Name</Th>
                <Th className="narrow">Type</Th>
              </FixedRow>
            </Thead>
            <Tbody>
              {resourceFiles.map(
                ({ name, type }: Object, key: number): React.Element<any> => (
                  <Tr
                    key={key}
                    first={key === 0}
                    observeElement={key === 0 ? '.pane' : undefined}
                  >
                    <Td className="name">
                      <Text text={name} />
                    </Td>
                    <Td className="narrow">{type}</Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        )}
      </NoDataIf>
    </Pane>
  </Tabs>
);

export default pure(['resources', 'resourceFiles'])(ResourceTable);
