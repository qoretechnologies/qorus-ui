import React, { Component, PropTypes } from 'react';
import { Groups, Group } from 'components/groups';
import Options from '../../../components/options';
import { connect } from 'react-redux';

import AlertsTab from '../../../components/alerts_table';
import Author from '../../../components/author';
import actions from 'store/api/actions';

@connect(
  null,
  {
    setOptions: actions.workflows.setOptions,
  }
)
export default class DetailTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
    setOptions: PropTypes.func.isRequired,
  };

  setOption = (opt) => {
    this.props.setOptions(this.props.workflow, opt.name, opt.value);
  };

  deleteOption = (opt) => {
    this.setOption(Object.assign({}, opt, { value: '' }));
  };

  render() {
    return (
      <div>
        <Author model={this.props.workflow} />
        <AlertsTab alerts={this.props.workflow.alerts} />
        <Groups>
          {
            (this.props.workflow.groups || []).map(g => (
              <Group
                key={g.name}
                name={g.name}
                url={`/groups?group=${g.name}`}
                size={g.size}
                disabled={!g.enabled}
              />
            ))
          }
        </Groups>
        <Options
          model={this.props.workflow}
          systemOptions={this.props.systemOptions}
          onSet={this.setOption}
          onDelete={this.deleteOption}
        />
      </div>
    );
  }
}
