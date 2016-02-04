import React, { Component, PropTypes } from 'react';
import { Groups, Group } from 'components/groups';
import Options from 'components/options';


import { pureRender } from 'components/utils';
import actions from 'store/api/actions';


@pureRender
export default class DetailTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
  };


  static contextTypes = {
    dispatch: PropTypes.func,
  };


  setOption(opt) {
    this.context.dispatch(
      actions.workflows.setOptions(this.props.workflow, opt.name, opt.value)
    );
  }


  deleteOption(opt) {
    this.setOption(Object.assign({}, opt, { value: '' }));
  }


  render() {
    return (
      <div>
        <Groups>
          {
            (this.props.workflow.groups || []).map(g => (
              <Group
                key={g.name}
                name={g.name}
                url={`/groups/${g.name}`}
                size={g.size}
                disabled={!g.enabled}
              />
            ))
          }
        </Groups>
        <Options
          workflow={this.props.workflow}
          systemOptions={this.props.systemOptions}
          onSet={::this.setOption}
          onDelete={::this.deleteOption}
        />
      </div>
    );
  }
}
