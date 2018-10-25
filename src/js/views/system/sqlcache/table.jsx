/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import { Table, Tbody, Thead, Tr, Th } from '../../../components/new_table';
import CacheRow from './row';
import Pull from '../../../components/Pull';
import NoDataIf from '../../../components/NoDataIf';
import ExpandableItem from '../../../components/ExpandableItem';
import { Control as Button } from '../../../components/controls';
import Headbar from '../../../components/Headbar';

type Props = {
  name: string,
  data: Object,
  dataLen: number,
  onClick: Function,
  onSingleClick: Function,
  expanded: boolean,
  handleExpandClick: Function,
  setExpanded: Function,
};

const SQLCacheTable: Function = ({
  name,
  data,
  onClick,
  onSingleClick,
}: Props): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(name);
  };

  return (
    <ExpandableItem title={name} show>
      <NoDataIf condition={Object.keys(data).length <= 0}>
        {() => (
          <div>
            <Headbar>
              <Pull right>
                <Button
                  text="Clear datasource"
                  iconName="trash"
                  onClick={handleClick}
                  btnStyle="danger"
                  big
                />
              </Pull>
            </Headbar>
            <Table condensed striped>
              <Thead>
                <Tr>
                  <Th className="name">Name</Th>
                  <Th className="narrow">Count</Th>
                  <Th className="big">Created</Th>
                  <Th className="narrow"> Actions </Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.keys(data).map((cache, index) => (
                  <CacheRow
                    key={index}
                    datasource={name}
                    name={cache}
                    count={data[cache].count}
                    created={data[cache].created}
                    onClick={onSingleClick}
                  />
                ))}
              </Tbody>
            </Table>
          </div>
        )}
      </NoDataIf>
    </ExpandableItem>
  );
};

export default compose(pure(['dataLen']))(SQLCacheTable);
