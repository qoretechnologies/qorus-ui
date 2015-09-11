import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';
import qorusApi from '../qorus';
import Loader from '../components/loader';
import clNs from 'classnames';
import Toolbar from '../components/toolbar';
import Table, { Col, Cell } from '../components/table';

@connect(state => ({
  workflows: state.workflows,
  info: state.systemInfo.data
}))
@pureRender
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
        <Col name='ID' dataKey='workflowid' />
        <Col name='Name' dataKey='name' />
        <Col name='Version' dataKey='version' />
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
