import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';
import qorusApi from '../qorus';
import Loader from '../components/loader';
import clNs from 'classnames';


@connect(state => ({
  workflows: state.workflows
}))
@pureRender
class Workflows extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    workflows: PropTypes.object
  }

  constructor(...props) {
    super(...props);
    const { dispatch } = this.props;
    dispatch(qorusApi.actions.workflows.sync());
  }

  render() {
    const { workflows } = this.props;
    const cls = clNs([
      'table', 'table-striped', 'table-condensed',
      'table-hover', 'table-fixed'
    ]);


    if (!workflows.sync) {
      return <Loader />;
    }

    return (
      <table className={ cls }>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
        { workflows.data.map((workflow)=> {
          const data = workflow;
          return (
            <tr key={ `${data.workflowid}-${data.name}` }>
              <td>{data.workflowid}</td>
              <td>{data.name}</td>
            </tr>
          );
        })}

        </tbody>
      </table>
    );
  }
}

export default Workflows;
