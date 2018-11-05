/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';

import { Tr, Td } from '../../../components/new_table';
import DateComponent from '../../../components/date';
import {
  getDump,
  removeDump,
} from '../../../store/api/resources/valuemaps/actions';
import { utf8ToB64 } from '../../../helpers/system';
import DetailButton from '../../../components/detail_button';

type Props = {
  openPane: Function,
  closePane: Function,
  dump?: Function,
  remove?: Function,
  data: Object,
  isTablet: boolean,
  isActive: boolean,
  first: boolean,
};

@connect(
  () => ({}),
  {
    dump: getDump,
    remove: removeDump,
  }
)
export default class ValuemapRow extends Component {
  props: Props;

  componentDidUpdate(): void {
    const { data, remove } = this.props;
    const { download } = this.refs;

    if (data.dump && remove) {
      download.click();
      remove(data.id);
    }
  }

  handleDetailClick: Function = (): void => {
    if (this.props.isActive) {
      this.props.closePane();
    } else {
      this.props.openPane(this.props.data.id);
    }
  };

  handleDumpClick: Function = (event: EventHandler): void => {
    event.stopPropagation();

    const { dump } = this.props;

    if (dump) {
      dump(this.props.data.id);
    }
  };

  handleDownloadClick: Function = (event: EventHandler): void => {
    event.stopPropagation();
  };

  render() {
    const { data, isTablet, isActive, first } = this.props;

    return (
      <Tr first={first} className={isActive ? 'row-active' : ''}>
        <Td className="narrow">
          <DetailButton active={isActive} onClick={this.handleDetailClick} />
        </Td>
        <Td className="name">{data.name}</Td>
        <Td className="text">{data.description}</Td>
        <Td className="text">{data.author}</Td>
        <Td className="medium">
          <code>{data.valuetype}</code>
        </Td>
        <Td className="narrow">{data.mapsize}</Td>
        {!isTablet && (
          <Td>
            <DateComponent date={data.created} />
          </Td>
        )}
        {!isTablet && (
          <Td>
            <DateComponent date={data.modified} />
          </Td>
        )}
        <Td className="narrow">
          <Button
            iconName="download"
            onClick={this.handleDumpClick}
            className="pt-small"
          />
          {data.dump && (
            <a
              ref="download"
              download={`${data.name}.qvset`}
              onClick={this.handleDownloadClick}
              href={`data:text/plain;base64,${utf8ToB64(data.dump[data.name])}`}
            />
          )}
        </Td>
      </Tr>
    );
  }
}
