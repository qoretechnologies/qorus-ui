import React, { Component, PropTypes } from 'react';
import { Groups, Group } from 'components/groups';
import Options from 'components/options';


import { pureRender } from 'components/utils';
import actions from 'store/api/actions';


@pureRender
export default class DetailTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired
  }

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
          options={this.props.options}
          onAdd={this.setOption.bind(this)}
          onChange={this.setOption.bind(this)}
          onDelete={this.deleteOption.bind(this)}
        />
      </div>
    );
  }
}
