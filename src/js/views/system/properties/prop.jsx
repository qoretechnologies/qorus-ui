import React, { Component, PropTypes } from 'react';

import Table, { Section, Row, Cell } from 'components/table';
import { Controls, Control } from 'components/controls';
import { pureRender } from 'components/utils';

@pureRender
export default class Property extends Component {
  static propTypes = {
    data: PropTypes.object,
    title: PropTypes.string,
    filter: PropTypes.string,
    manage: PropTypes.bool,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
  };

  handlePropDeleteClick = () => {
    this.props.onDelete({ domain: this.props.title });
  };

  handleKeyDeleteClick = key => () => this.props.onDelete({ domain: this.props.title, key });

  handleEditClick = (key, value) => () => (
    this.props.onEdit({ domain: this.props.title, key, value })
  );

  renderControls(key, value) {
    if (!this.props.manage) return undefined;

    return (
      <Controls grouped>
        <Control
          icon="pencil"
          btnStyle="warning"
          action={this.handleEditClick(key, value)}
        />
        <Control
          icon="times"
          btnStyle="danger"
          action={this.handleKeyDeleteClick(key)}
        />
      </Controls>
    );
  }

  renderRows() {
    return Object.keys(this.props.data).map((d, key) => (
      <Row key={key}>
        <Cell tag="th">{ d }</Cell>
        <Cell>{ this.props.data[d] }</Cell>
        <Cell>{ this.renderControls(d, this.props.data[d]) }</Cell>
      </Row>
    ));
  }

  render() {
    const { title } = this.props;
    return (
      <div className="container-fluid">
        <h4>
          { title }
          { this.props.manage && (
            <div className="pull-right">
              <Controls grouped>
                <Control
                  icon="times"
                  btnStyle="danger"
                  action={this.handlePropDeleteClick}
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
