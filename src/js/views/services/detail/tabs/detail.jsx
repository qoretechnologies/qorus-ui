import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Groups, Group } from 'components/groups';
import Author from 'components/author';
import Options from '../../../../components/options';
import actions from 'store/api/actions';
import AlertsTable from '../../../../components/alerts_table';
import PaneItem from '../../../../components/pane_item';
import ServicesControls from '../../controls';

@connect(
  () => ({}),
  actions.services
)
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
    const { service } = this.props;

    return (
      <div>
        <PaneItem title="Controls">
          <ServicesControls
            status={service.status}
            enabled={service.enabled}
            autostart={service.autostart}
            id={service.id}
          />
        </PaneItem>
        <PaneItem title="Description">{service.desc}</PaneItem>
        <Author model={service} />
        <AlertsTable alerts={service.alerts} />
        <Groups>
          {(service.groups || []).map(g => (
            <Group
              key={g.name}
              name={g.name}
              url={`/groups?group=${g.name}`}
              size={g.size}
              disabled={!g.enabled}
            />
          ))}
        </Groups>
        <Options
          model={service}
          systemOptions={this.props.systemOptions}
          onSet={::this.setOption}
          onDelete={::this.deleteOption}
        />
      </div>
    );
  }
}
