import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Groups, Group } from 'components/groups';
import Author from 'components/author';
import Options from 'components/options';
import actions from 'store/api/actions';
import AlertsTable from '../../../../components/alerts_table';

@connect(() => ({}), actions.services)
export default class DetailTab extends Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
    setOptions: PropTypes.func.isRequired,
  };

  setOption(opt) {
    this.props.setOptions(this.props.service, opt.name, opt.value);
  }


  deleteOption(opt) {
    this.setOption(Object.assign({}, opt, { value: '' }));
  }


  render() {
    return (
      <div>
        <Author model={this.props.service} />
        <AlertsTable alerts={this.props.service.alerts} />
        <Groups>
          {
            (this.props.service.groups || []).map(g => (
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
          model={this.props.service}
          systemOptions={this.props.systemOptions}
          onSet={::this.setOption}
          onDelete={::this.deleteOption}
        />
      </div>
    );
  }
}
