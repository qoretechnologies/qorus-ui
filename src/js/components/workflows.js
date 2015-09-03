import React from 'react';
import { connect } from 'react-redux';
import { fetch } from '../store/workflows/actions';

class Workflows extends React.Component {
  constructor(...props) {
    super(...props);
    const { dispatch} = this.props;
    dispatch(fetch());
  }

  render() {
    console.log('render', this.props);
    return <table>
      <thead>
        <tr>
          <th>ID</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {this.props.workflows && this.props.workflows.map((workflow)=> {
        const data = workflow.data();
        <tr>
          <td>{data.id}</td>
          <td></td>
        </tr>
        })}

      </tbody>
    </table>;
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Workflows);