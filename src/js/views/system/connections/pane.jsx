import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { capitalize, includes } from 'lodash';

import Pane from '../../../components/pane';
import { Table, Tbody, Tr, Td, EditableCell } from '../../../components/new_table';
import AutoComponent from '../../../components/autocomponent';
import actions from '../../../store/api/actions';
import Alert from '../../../components/alert';

const remoteSelector = (state, props) => (
  state.api.remotes.data.find(a => a.name === props.paneId)
);

const attrsSelector = (state, props) => {
  const { remoteType } = props;
  let attrs;
  let editable = [];

  switch (remoteType) {
    case 'datasources': {
      attrs = [
        'conntype',
        'locked',
        'up',
        'monitor',
        'status',
        'last_check',
        'type',
        'user',
        'pass',
        'db',
        'charset',
        'port',
        'host',
        'options',
      ];

      editable = [
        'type',
        'user',
        'pass',
        'db',
        'charset',
        'port',
        'host',
        'options',
      ];

      break;
    }
    case 'qorus': {
      attrs = [
        'conntype',
        'up',
        'monitor',
        'status',
      ];

      break;
    }
    default: {
      attrs = [
        'conntype',
        'up',
        'monitor',
        'status',
        'last_check',
        'type',
        'opts',
        'desc',
        'url',
      ];

      editable = [
        'desc',
        'url',
        'opts',
      ];

      break;
    }
  }

  return {
    attrs,
    editable,
  };
};

const viewSelector = createSelector(
  [
    remoteSelector,
    attrsSelector,
  ],
  (remote, attrs) => ({
    remote,
    attrs: attrs.attrs,
    editable: attrs.editable,
  })
);

@connect(
  viewSelector,
  {
    onSave: actions.remotes.manageConnection,
  }
)
export default class ConnectionsPane extends Component {
  static propTypes = {
    remote: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    attrs: PropTypes.array,
    editable: PropTypes.array,
    type: PropTypes.string,
    width: PropTypes.number,
    onResize: PropTypes.func,
    onSave: PropTypes.func,
    remoteType: PropTypes.string,
    canEdit: PropTypes.bool,
  };

  state: {
    error: ?string,
  } = {
    error: null,
  };

  getData: Function = () => {
    const data = [];

    for (const attr of this.props.attrs) {
      data.push({
        attr,
        value: this.props.remote[attr],
        editable: includes(this.props.editable, attr),
      });
    }

    return data;
  }

  handleEditSave: Function = (attr: string) => (value: any) => {
    const { onSave, remoteType } = this.props;
    const data = { ...this.props.remote, ...{ [attr]: value } };
    const optsKey = remoteType === 'user' ? 'opts' : 'options';

    try {
      if (value !== '' && (attr === 'options' || attr === 'opts')) {
        JSON.parse(data[optsKey]);
      }
    } catch (e) {
      this.setState({
        error: 'The "options" value must be in valid JSON string format!',
      });
    } finally {
      if (value !== '' && (attr === 'options' || attr === 'opts')) {
        data[optsKey] = JSON.parse(data[optsKey]);
      }

      let proceed = true;

      Object.keys(data[optsKey]).forEach((key: string): Object => {
        proceed = typeof data[optsKey][key] === 'object' ?
          false :
          proceed;
      });

      if (!proceed) {
        this.setState({
          error: 'The "options" object is invalid. It cannot be nested.',
        });
      } else if (onSave) {
        onSave(remoteType, data, this.props.remote.name);
      }
    }
  }

  render() {
    return (
      <Pane
        width={this.props.width || 400}
        onClose={this.props.onClose}
        onResize={this.props.onResize}
      >
        <h3>{ this.props.remote.name } detail</h3>
        {this.state.error && (
          <Alert bsStyle="danger">{this.state.error}</Alert>
        )}
        <Table striped>
          <Tbody>
            {this.getData().map((val: Object, key: number): React.Element<any> => (
              <Tr key={key}>
                <Td className="name">{capitalize(val.attr)}</Td>
                {val.editable && this.props.canEdit ? (
                  <EditableCell
                    value={
                      val.value !== '' && (val.attr === 'options' || val.attr === 'opts') ?
                      JSON.stringify(val.value) :
                      val.value
                    }
                    onSave={this.handleEditSave(val.attr)}
                  />
                ) : (
                  <Td><AutoComponent>{val.value}</AutoComponent></Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Pane>
    );
  }
}
