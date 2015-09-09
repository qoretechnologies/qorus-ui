import React from 'react';
import { connect } from 'react-redux';
import store from '../store';
import pureRender from 'pure-render-decorator';
import qorusApi from '../qorus';
import Loader from '../components/loader';


@connect(state => ({
  workflows: state.workflows
}))
@pureRender
class Workflows extends React.Component {
  constructor(...props) {
    super(...props);
    const { dispatch } = this.props;
    dispatch(qorusApi.actions.workflows.sync());
  }

  render() {
    let { workflows } = this.props;

		console.log(workflows);

    if (!workflows.sync) {
      return <Loader />;
    } else {
      return (
        <table className="table table-striped table-condensed table-hover table-fixed">
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
}

export default Workflows;
