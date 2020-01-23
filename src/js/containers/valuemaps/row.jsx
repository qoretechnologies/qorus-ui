// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Tr, Td } from '../../components/new_table';
import { connect } from 'react-redux';
import {
  getDump,
  removeDump,
} from '../../store/api/resources/valuemaps/actions';
import NameColumn from '../../components/NameColumn';
import { IdColumn } from '../../components/IdColumn';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import { utf8ToB64 } from '../../helpers/system';
import { AuthorColumn } from '../../components/AuthorColumn';
import { DateColumn } from '../../components/DateColumn';
import { DescriptionColumn } from '../../components/DescriptionColumn';
import ContentByType from '../../components/ContentByType';

type ValueMapsRowProps = {
  first: boolean,
  openPane: Function,
  closePane: Function,
  dump?: Function,
  remove?: Function,
  isActive?: boolean,
  data: Object,
  compact: boolean,
};

@connect(
  () => ({}),
  {
    dump: getDump,
    remove: removeDump,
  }
)
class ValueMapsRow extends Component {
  props: ValueMapsRowProps;

  componentDidUpdate (): void {
    const { data, remove, compact } = this.props;

    if (!compact) {
      const { download } = this.refs;

      if (data.dump && remove) {
        download.click();
        remove(data.id);
      }
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

  render () {
    const { first, isActive, compact, data } = this.props;
    return (
      <Tr first={first} className={isActive ? 'row-active' : ''}>
        <IdColumn>{data.id}</IdColumn>
        <NameColumn
          isActive={isActive}
          name={data.name}
          onDetailClick={!compact && this.handleDetailClick}
          link={compact && `valuemaps?paneId=${data.id}`}
          type={compact && 'valuemaps'}
        />
        {!compact && (
          <Td className="narrow">
            <ButtonGroup>
              <Button icon="download" onClick={this.handleDumpClick} />
              {data.dump && (
                <a
                  ref="download"
                  download={`${data.name}.qvset`}
                  onClick={this.handleDownloadClick}
                  href={`data:text/plain;base64,${utf8ToB64(
                    data.dump[data.name]
                  )}`}
                />
              )}
            </ButtonGroup>
          </Td>
        )}
        <Td className="medium">{data.mapsize}</Td>
        <Td className="medium">
          <ContentByType content={data.throws_exception} />
        </Td>
        <Td className="medium">
          <code>{data.valuetype}</code>
        </Td>
        {!compact && <AuthorColumn>{data.author}</AuthorColumn>}
        {!compact && <DateColumn>{data.created}</DateColumn>}
        {!compact && <DateColumn>{data.modified}</DateColumn>}
        {!compact && <DescriptionColumn>{data.description}</DescriptionColumn>}
      </Tr>
    );
  }
}

export default compose(
  onlyUpdateForKeys(['first', 'data', 'isActive', 'dump'])
)(ValueMapsRow);
