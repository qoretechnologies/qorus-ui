/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import lifecycle from 'recompose/lifecycle';

import Section from './section';
import SourceCode from '../../components/source_code';

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
          <h5>{ selected.name }</h5>
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
  withState('selected', 'setSelected', null),
  mapProps(({ heightUpdater, setHeight, setSelected, ...rest }): Object => ({
    calculateHeight: () => setHeight((height: string | number) => (
      heightUpdater ? heightUpdater() : height
    )),
    onItemClick: (name: string, code: string) => setSelected(() => ({
      name,
      code,
    })),
    ...rest,
  })),
  lifecycle({
    componentWillMount() {
      this.props.calculateHeight();

      window.addEventListener('resize', () => {
        this.props.calculateHeight();
      });
    },
    componentWillUnmount() {
      window.removeEventListener('resize', () => {
        this.props.calculateHeight();
      });
    },
  })
)(Code);
