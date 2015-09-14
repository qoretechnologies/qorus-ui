import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';
import qorusApi from '../qorus';
import Loader from '../components/loader';
import clNs from 'classnames';
import Toolbar from '../components/toolbar';
import Table, { Col } from '../components/table';

@pureRender
@connect(state => ({
  workflows: state.workflows,
  info: state.systemInfo.data
}))
class Workflows extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    instanceKey: PropTypes.string,
    workflows: PropTypes.object,
    info: PropTypes.object
  }

  constructor(...props) {
    super(...props);
    const { dispatch } = this.props;
    dispatch(qorusApi.actions.workflows.sync());
  }

  componentDidMount() {
    this.setTitle();
  }

  componentDidUpdate() {
    this.setTitle();
  }

  setTitle() {
    const { info } = this.props;

    const inst = info['instance-key'] ? info['instance-key'] : 'Qorus';

    document.title = `Workflows | ${inst}`;
  }

  renderTable() {
    const { workflows } = this.props;
    const cls = clNs([
      'table', 'table-striped', 'table-condensed',
      'table-hover', 'table-fixed'
    ]);

    return (
      <Table collection={ workflows.data } className={ cls }>
        <Col name=''>
          <i className="fa fa-square-o" />
        </Col>
        <Col name='Actions'>
          <a className="label"><i className="fa fa-power-off" /></a>
          <a className="label"><i className="fa fa-refresh" /></a>
        </Col>
        <Col name='ID' dataKey='id' />
        <Col name='Name' dataKey='name' />
        <Col name='C' dataKey='COMPLETE' />
        <Col name='Y' dataKey='READY' />
        <Col name='S' dataKey='SCHEDULED' />
        <Col name='N' dataKey='INCOMPLETE' />
        <Col name='V' dataKey='EVENT-WAITING' />
        <Col name='A' dataKey='ASYNC-WAITING' />
        <Col name='W' dataKey='WAITING' />
        <Col name='R' dataKey='RETRY' />
        <Col name='E' dataKey='ERROR' />
        <Col name='I' dataKey='IN-PROGRESS' />
        <Col name='X' dataKey='CANCELED' />
        <Col name='B' dataKey='BLOCKED' />
        <Col name='Total' dataKey='TOTAL' />
      </Table>
    );
  }

  render() {
    const { workflows } = this.props;

    if (!workflows.sync) {
      return <Loader />;
    }

    return (
      <div>
        <Toolbar />
        { this.renderTable() }
      </div>
    );
  }
}

export default Workflows;
