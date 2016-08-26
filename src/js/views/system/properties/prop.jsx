import React, { Component, PropTypes } from 'react';

import Table, { Section, Row, Cell } from 'components/table';
import PermButton from './perm_control';
import { Controls } from 'components/controls';

export default class Property extends Component {
  static propTypes = {
    data: PropTypes.object,
    title: PropTypes.string,
    perms: PropTypes.array,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
  };

  handlePropDeleteClick = () => {
    this.props.onDelete({ domain: this.props.title });
  };

  handleKeyDeleteClick = key => () => {
    this.props.onDelete({ domain: this.props.title, key });
  };

  handleEditClick = (key, value) => () => (
    this.props.onEdit(null, { domain: this.props.title, key, value })
  );

  renderControls(key, value) {
    const { title, perms } = this.props;

    if (title === 'omq') return null;

    return (
      <Controls grouped>
        <PermButton
          perms={perms}
          reqPerms={['SERVER-CONTROL', 'SET-PROPERTY']}
          icon="pencil"
          btnStyle="warning"
          onClick={this.handleEditClick(key, value)}
        />
        <PermButton
          perms={perms}
          reqPerms={['SERVER-CONTROL', 'DELETE-PROPERTY']}
          icon="times"
          btnStyle="danger"
          onClick={this.handleKeyDeleteClick(key)}
        />
      </Controls>
    );
  }

  renderRows() {
    const { data } = this.props;

    return Object.keys(data).map((d, key) => (
      <Row key={key}>
        <Cell tag="th">{ d }</Cell>
        <Cell>
          { typeof data[d] === 'string' ? data[d] : JSON.stringify(data[d]) }
        </Cell>
        <Cell>{ this.renderControls(d, data[d]) }</Cell>
      </Row>
    ));
  }

  render() {
    const { title, perms } = this.props;

    return (
      <div className="container-fluid">
        <h4>
          { title }
          { title !== 'omq' && (
            <div className="pull-right">
              <Controls grouped>
                <PermButton
                  perms={perms}
                  reqPerms={['SERVER-CONTROL', 'DELETE-PROPERTY']}
                  icon="times"
                  btnStyle="danger"
                  onClick={this.handlePropDeleteClick}
                />
              </Controls>
            </div>
          )}
        </h4>
        <Table className="table table-condensed table-striped props-table">
          <Section type="body">
            { this.renderRows() }
          </Section>
        </Table>
      </div>
    );
  }
}
