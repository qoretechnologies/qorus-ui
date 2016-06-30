import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Table, { Section, Row, Cell } from 'components/table';
import { pureRender } from 'components/utils';

@pureRender
export default class GroupDetailTable extends Component {
  static propTypes = {
    data: PropTypes.array,
    type: PropTypes.string,
    columns: PropTypes.array,
  };

  renderHeaders() {
    return this.props.columns.map((c, index) => (
      <Cell tag="th" key={index}>
        { c }
      </Cell>
    ));
  }

  renderColumns(d) {
    return this.props.columns.map((c, index) => {
      const name = d[c.toLowerCase()];
      let val = d[c.toLowerCase()];
      let css;

      if (c === 'Name') {
        css = 'name';

        switch (this.props.type) {
          case 'Services':
            val = <Link to="/services"> { name } </Link>;
            break;
          case 'Workflows':
            val = <Link to={`/workflow/${d.workflowid}`}> { name } </Link>;
            break;
          case 'Jobs':
            val = <Link to={`/jobs/${d.jobid}`}> { name } </Link>;
            break;
          case 'Roles':
            val = d;
            break;
          default:
            break;
        }
      }

      return (
        <Cell key={index} className={css}>
          { val }
        </Cell>
      );
    });
  }

  renderRows() {
    return this.props.data.map((d, index) => (
      <Row key={index}>
        { this.renderColumns(d) }
      </Row>
    ));
  }

  renderTable() {
    if (!this.props.data.length) return <p> No data </p>;

    return (
      <Table className="table table-condensed table--data table-fixed table-striped">
        <Section type="head">
          <Row>
            { this.renderHeaders() }
          </Row>
        </Section>
        <Section type="body">
          { this.renderRows() }
        </Section>
      </Table>
    );
  }

  render() {
    return (
      <div className="col-xs-4">
        <h4> { this.props.type } </h4>
        { this.renderTable() }
      </div>
    );
  }
}
