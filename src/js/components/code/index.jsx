/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import lifecycle from 'recompose/lifecycle';
import capitalize from 'lodash/capitalize';

import Section from './section';
import SourceCode from '../../components/source_code';
import InfoTable from '../../components/info_table';

type Props = {
  data: Object,
  height: string | number,
  selected: Object,
  onItemClick: Function,
};

const Code: Function = ({
  data,
  height,
  onItemClick,
  selected,
}: Props): React.Element<any> => (
  <div className="code">
    <div className="code-list" style={{ height }}>
      {Object.keys(data).map((name: string, index: number): React.Element<any> => (
        <Section
          key={index}
          name={name}
          items={data[name]}
          onItemClick={onItemClick}
          selected={selected}
        />
      ))}
    </div>
    <div className="code-source">
      { selected && (
        <div>
          {selected.item ? (
            <h5>
              {`${capitalize(selected.name)}
              ${selected.item.version ? `v${selected.item.version}` : ''}
              ${selected.item.id ? `(${selected.item.id})` : ''}`}
            </h5>
          ) : (
            <h5>{capitalize(selected.name)}</h5>
          )}
          {selected.item && (
            <InfoTable
              object={selected.item}
              pick={
                selected.item.tags && Object.keys(selected.item.tags).length ?
                ['author', 'offset', 'source', 'description', 'tags'] :
                ['author', 'offset', 'source', 'description']
              }
            />
          )}
          <SourceCode height={typeof height === 'number' ? height - 35 : height}>
            { selected.code }
          </SourceCode>
        </div>
      )}
    </div>
  </div>
);

export default compose(
  withState('height', 'setHeight', 'auto'),
  withState('selected', 'setSelected', ({ selected }) => selected || null),
  mapProps(({ heightUpdater, setHeight, setSelected, ...rest }): Object => ({
    calculateHeight: () => setHeight((height: string | number) => (
      heightUpdater ? heightUpdater() : height
    )),
    onItemClick: (
      name: string,
      code: string,
      type: string,
      id: number,
      item: Object,
    ) => setSelected(() => ({
      name,
      code,
      item,
    })),
    ...rest,
  })),
  lifecycle({
    componentWillMount() {
      this.props.calculateHeight();

      window.addEventListener('resize', this.props.calculateHeight);
    },
    componentWillUnmount() {
      window.removeEventListener('resize', this.props.calculateHeight);
    },
  })
)(Code);
