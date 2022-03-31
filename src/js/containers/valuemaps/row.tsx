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
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
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

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dump' does not exist on type 'Object'.
      if (data.dump && remove) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'click' does not exist on type 'ReactInst... Remove this comment to see the full error message
        download.click();
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        remove(data.id);
      }
    }
  }

  handleDetailClick: Function = (): void => {
    if (this.props.isActive) {
      this.props.closePane();
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      this.props.openPane(this.props.data.id);
    }
  };

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleDumpClick: Function = (event: EventHandler): void => {
    event.stopPropagation();

    const { dump } = this.props;

    if (dump) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      dump(this.props.data.id);
    }
  };

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'EventHandler'.
  handleDownloadClick: Function = (event: EventHandler): void => {
    event.stopPropagation();
  };

  render () {
    const { first, isActive, compact, data } = this.props;
    return (
      <Tr first={first} className={isActive ? 'row-active' : ''}>
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'. */ }
        <IdColumn>{data.id}</IdColumn>
        <NameColumn
          isActive={isActive}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          name={data.name}
          onDetailClick={!compact && this.handleDetailClick}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          link={compact && `valuemaps?paneId=${data.id}`}
          type={compact && 'valuemaps'}
        />
        {!compact && (
          <Td className="narrow">
            <ButtonGroup>
              <Button icon="download" onClick={this.handleDumpClick} />
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'dump' does not exist on type 'Object'. */ }
              {data.dump && (
                <a
                  ref="download"
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                  download={`${data.name}.qvset`}
                  // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
                  onClick={this.handleDownloadClick}
                  href={`data:text/plain;base64,${utf8ToB64(
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dump' does not exist on type 'Object'.
                    data.dump[data.name]
                  )}`}
                />
              )}
            </ButtonGroup>
          </Td>
        )}
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'mapsize' does not exist on type 'Object'... Remove this comment to see the full error message */ }
        <Td className="medium">{data.mapsize}</Td>
        <Td className="medium">
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'throws_exception' does not exist on type... Remove this comment to see the full error message */ }
          <ContentByType content={data.throws_exception} />
        </Td>
        <Td className="medium">
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'valuetype' does not exist on type 'Objec... Remove this comment to see the full error message */ }
          <code>{data.valuetype}</code>
        </Td>
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'author' does not exist on type 'Object'. */ }
        {!compact && <AuthorColumn>{data.author}</AuthorColumn>}
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'created' does not exist on type 'Object'... Remove this comment to see the full error message */ }
        {!compact && <DateColumn>{data.created}</DateColumn>}
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'modified' does not exist on type 'Object... Remove this comment to see the full error message */ }
        {!compact && <DateColumn>{data.modified}</DateColumn>}
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'description' does not exist on type 'Obj... Remove this comment to see the full error message */ }
        {!compact && <DescriptionColumn>{data.description}</DescriptionColumn>}
      </Tr>
    );
  }
}

export default compose(
  onlyUpdateForKeys(['first', 'data', 'isActive', 'dump'])
)(ValueMapsRow);
