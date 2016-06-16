import React, { Component, PropTypes } from 'react';

import { Control as Button } from 'components/controls';
import { Section, Row, Cell } from 'components/table';
import Date from 'components/date';
import AutoComponent from 'components/autocomponent';
import CSVModal from '../../errors/csv';

export default class DiagramErrorsRow extends Component {
  static propTypes = {
    data: PropTypes.object,
    expand: PropTypes.bool,
    stringifyError: PropTypes.func,
  };

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    selectModalText: PropTypes.func,
  };

  componentWillMount() {
    this.setState({
      expand: this.props.expand,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.expand !== nextProps.expand) {
      this.setState({
        expand: nextProps.expand,
      });
    }
  }

  handleRowClick = () => {
    this.setState({
      expand: !this.state.expand,
    });
  };

  handleCopyClick = () => {
    const data = this.props.stringifyError(this.props.data);

    this._modal = (
      <CSVModal
        onMount={this.context.selectModalText}
        onClose={this.handleModalCloseClick}
        data={data}
      />
    );

    this.context.openModal(this._modal);
  };

  handleModalCloseClick = () => {
    this.context.closeModal(this._modal);
  };

  renderDetail() {
    if (!this.state.expand) return undefined;

    return (
      <Row>
        <Cell colspan={5}>
          { this.props.data.info }
          <Button
            label="Copy error"
            icon="copy"
            className="pull-right"
            btnStyle="success"
            action={this.handleCopyClick}
          />
        </Cell>
      </Row>
    );
  }

  render() {
    const { ...data } = this.props.data;

    return (
      <Section type="body">
        <Row onClick={this.handleRowClick}>
          <Cell>{ data.severity }</Cell>
          <Cell>{ data.error }</Cell>
          <Cell>
            <Date date={data.created} />
          </Cell>
          <Cell>{ data.description }</Cell>
          <Cell className="narrow">
            <AutoComponent>
              { data.business_error }
            </AutoComponent>
          </Cell>
        </Row>
        { this.renderDetail() }
      </Section>
    );
  }
}
