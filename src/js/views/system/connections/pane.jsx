import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { capitalize, includes } from 'lodash';
import { Link } from 'react-router';

import Pane from '../../../components/pane';
import {
  Table,
  Tbody,
  Tr,
  Td,
  EditableCell,
} from '../../../components/new_table';
import AutoComponent from '../../../components/autocomponent';
import Box from '../../../components/box';
import Container from '../../../components/container';
import NoData from '../../../components/nodata';
import actions from '../../../store/api/actions';
import Alert from '../../../components/alert';
import Options from './options';
import { getDependencyObjectLink } from '../../../helpers/system';
import AlertsTable from '../../../components/alerts_table';
import PaneItem from '../../../components/pane_item';
import { attrsSelector } from '../../../helpers/remotes';
import withDispatch from '../../../hocomponents/withDispatch';

const remoteSelector = (state, props) =>
  state.api.remotes.data.find(a => a.name === props.paneId);

const viewSelector = createSelector(
  [remoteSelector, attrsSelector],
  (remote, attrs) => ({
    remote,
    attrs: attrs.attrs,
    editable: attrs.editable,
  })
);

@connect(viewSelector)
@withDispatch()
export default class ConnectionsPane extends Component {
  static propTypes = {
    remote: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    attrs: PropTypes.array,
    editable: PropTypes.array,
    type: PropTypes.string,
    width: PropTypes.number,
    onResize: PropTypes.func,
    optimisticDispatch: PropTypes.func,
    remoteType: PropTypes.string,
    canEdit: PropTypes.bool,
  };

  state: {
    error: ?string,
    options: ?string,
  } = {
    error: null,
    options: null,
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
  };

  handleEditSave: Function = (attr: string) => (value: any) => {
    const { optimisticDispatch, remoteType } = this.props;
    const optsKey = remoteType === 'user' ? 'opts' : 'options';
    const val =
      (value === '' || value === '{}') &&
      (attr === 'options' || attr === 'opts')
        ? null
        : value;

    const data = { ...this.props.remote, ...{ [attr]: val } };

    try {
      if (val && val !== '' && (attr === 'options' || attr === 'opts')) {
        JSON.parse(data[optsKey]);
      }
    } catch (e) {
      this.setState({
        error: 'The "options" value must be in valid JSON string format!',
      });
    } finally {
      let proceed = true;

      if (val && val !== '' && (attr === 'options' || attr === 'opts')) {
        data[optsKey] = JSON.parse(data[optsKey]);

        Object.keys(data[optsKey]).forEach(
          (key: string): Object => {
            proceed = typeof data[optsKey][key] === 'object' ? false : proceed;
          }
        );
      }

      if (!proceed) {
        this.setState({
          error: 'The "options" object is invalid. It cannot be nested.',
        });
      } else if (optimisticDispatch) {
        optimisticDispatch(
          actions.remotes.manageConnection,
          remoteType,
          data,
          this.props.remote.name
        );
      }
    }
  };

  render() {
    const { deps, alerts } = this.props.remote;

    return (
      <Pane
        width={this.props.width || 400}
        onClose={this.props.onClose}
        onResize={this.props.onResize}
        title={`${this.props.remote.name} detail`}
      >
        {this.state.error && <Alert bsStyle="danger">{this.state.error}</Alert>}
        <Box top>
          <Container fill>
            <PaneItem title="Overview">
              <Table striped>
                <Tbody>
                  {this.getData().map(
                    (val: Object, key: number): React.Element<any> => (
                      <Tr key={key}>
                        <Td className="name">{capitalize(val.attr)}</Td>
                        {val.editable &&
                        this.props.canEdit &&
                        val.attr !== 'options' &&
                        val.attr !== 'opts' ? (
                          <EditableCell
                            className="text"
                            value={val.value}
                            onSave={this.handleEditSave(val.attr)}
                          />
                        ) : (
                          <Td className="text">
                            {val.attr === 'options' || val.attr === 'opts' ? (
                              <Options
                                data={val.value}
                                onSave={this.handleEditSave(val.attr)}
                              />
                            ) : (
                              <AutoComponent>{val.value}</AutoComponent>
                            )}
                          </Td>
                        )}
                      </Tr>
                    )
                  )}
                </Tbody>
              </Table>
            </PaneItem>
            <AlertsTable alerts={alerts} />
            <PaneItem title="Dependencies">
              {deps && deps.length ? (
                <Table striped condensed>
                  <Tbody>
                    {deps.map(
                      (dep: Object, index: number): React.Element<any> => (
                        <Tr key={index}>
                          <Td className="name">
                            <Link to={getDependencyObjectLink(dep.type, dep)}>
                              {dep.desc}
                            </Link>
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                </Table>
              ) : (
                <NoData />
              )}
            </PaneItem>
          </Container>
        </Box>
      </Pane>
    );
  }
}
