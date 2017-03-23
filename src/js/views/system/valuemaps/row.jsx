/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tr, Td } from '../../../components/new_table';
import { Control as Button } from '../../../components/controls';
import DateComponent from '../../../components/date';
import { getDump, removeDump } from '../../../store/api/resources/valuemaps/actions';
import { utf8ToB64 } from '../../../helpers/system';

type Props = {
  openPane: Function,
  dump?: Function,
  remove?: Function,
  data: Object,
}

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
    this.props.openPane(this.props.data.id);
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
    const { data } = this.props;

    return (
      <Tr>
        <Td className="name">{ data.name }</Td>
        <Td className="narrow">
          <Button
            btnStyle="success"
            label="Detail"
            action={this.handleDetailClick}
          />
        </Td>
        <Td className="text">{ data.description }</Td>
        <Td className="text">{ data.author }</Td>
        <Td><code>{ data.valuetype }</code></Td>
        <Td className="narrow">{ data.mapsize }</Td>
        <Td>
          <DateComponent date={data.created} />
        </Td>
        <Td>
          <DateComponent date={data.modified} />
        </Td>
        <Td>
          <Button
            label="Dump to file"
            icon="download"
            btnStyle="success"
            onClick={this.handleDumpClick}
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
