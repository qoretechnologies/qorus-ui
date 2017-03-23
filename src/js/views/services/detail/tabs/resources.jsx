// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import { Table, Tbody, Thead, Tr, Th, Td } from '../../../../components/new_table';
import Text from '../../../../components/text';
import Tree from '../../../../components/tree';

type Props = {
  resources: Object,
  resourceFiles: Array<Object>,
};

const ResourceTable: Function = ({
  resources,
  resourceFiles,
}: Props): React.Element<any> => (
  <div>
    <h4> Resources </h4>
    {resources ? (
      <Table
        fixed
        striped
      >
        <Thead>
          <Tr>
            <Th className="name">Name</Th>
            <Th className="text">Description</Th>
            <Th className="text">Info</Th>
            <Th className="text">Type</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(resources).map((resource: string, key: number): React.Element<any> => (
            <Tr key={key}>
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
                    placeholder="View info"
                    popup
                    text={<Tree data={resources[resource].info} />}
                  />
                </a>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    ): (
      <p className="no-data"> No data </p>
    )}
    <h4> Resource files </h4>
    {resourceFiles && resourceFiles.length > 0 ? (
      <Table
        fixed
        striped
      >
        <Thead>
          <Tr>
            <Th className="name">Name</Th>
            <Th className="narrow">Type</Th>
          </Tr>
        </Thead>
        <Tbody>
          {resourceFiles.map(({ name, type }: Object, key: number): React.Element<any> => (
            <Tr key={key}>
              <Td className="name">
                <Text text={name} />
              </Td>
              <Td className="narrow">{type}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    ): (
      <p className="no-data"> No data </p>
    )}
  </div>
);

export default pure(['resources', 'resourceFiles'])(ResourceTable);
