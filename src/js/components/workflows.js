import React from 'react';
import { connect } from 'react-redux';
import { fetch } from '../store/workflows/actions';
import store from '../store';

class Workflows extends React.Component {
  constructor(...props) {
    super(...props);
    const { dispatch } = this.props;
    dispatch(fetch());
  }

  render() {
    const { workflows } = this.props;

    return <table style={{ marginLeft: '100px', width: '100%' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
      { workflows.map((workflow)=> {
        const data = workflow.data();
        return (
          <tr key={ `${data.workflowid}-${data.name}` }>
            <td>{data.workflowid}</td>
            <td>{data.name}</td>
          </tr>
        );
        })}

      </tbody>
    </table>;
  }
}

function mapStateToProps(state) {
  return {
    workflows: state.workflows
  };
}

export default connect(mapStateToProps)(Workflows);
