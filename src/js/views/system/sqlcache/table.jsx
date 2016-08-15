/* @flow */
import React from 'react';
import Table, { Section, Row, Cell } from '../../../components/table';
import { Control as Button } from '../../../components/controls';
import CacheRow from './row';

type Props = {
  name: string,
  data: Object,
  onClick: Function,
  onSingleClick: Function,
}

const SQLCacheTable: Function = (
  { name, data, onClick, onSingleClick }: Props
): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(name);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="pull-left">
          <h4>{ name }</h4>
        </div>
        <div className="pull-right">
          <Button
            btnStyle="danger"
            big
            label="Clear datasource"
            icon="trash-o"
            action={handleClick}
          />
        </div>
      </div>
      { Object.keys(data).length > 0 && (
        <Table className="table table--data table-condensed table-striped">
          <Section type="head">
            <Row>
              <Cell tag="th" className="name">
                Name
              </Cell>
              <Cell tag="th" className="narrow">
                Count
              </Cell>
              <Cell tag="th">
                Created
              </Cell>
              <Cell tag="th" />
            </Row>
          </Section>
          <Section type="body">
            { Object.keys(data).map((cache, index) => (
              <CacheRow
                key={index}
                datasource={name}
                name={cache}
                count={data[cache].count}
                created={data[cache].created}
                onClick={onSingleClick}
              />
            ))}
          </Section>
        </Table>
      )}
      { Object.keys(data).length <= 0 && (
        <p> No data </p>
      )}
    </div>
  );
};

export default SQLCacheTable;
