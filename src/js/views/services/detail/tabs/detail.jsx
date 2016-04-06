import React, { Component, PropTypes } from 'react';
import { Groups, Group } from 'components/groups';
import Options from 'components/options';


import { pureRender } from 'components/utils';
import actions from 'store/api/actions';


@pureRender
export default class DetailTab extends Component {
  static propTypes = {
    service: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
  };


  static contextTypes = {
    dispatch: PropTypes.func,
  };


  setOption(opt) {
    this.context.dispatch(
      actions.services.setOptions(this.props.service, opt.name, opt.value)
    );
  }


  deleteOption(opt) {
    this.setOption(Object.assign({}, opt, { value: '' }));
  }


  render() {
    return (
      <div>
        <div className="svc__desc">
          <p className="text-muted">
            <em>{this.props.service.desc}</em>
          </p>
        </div>
        <Groups>
          {
            (this.props.service.groups || []).map(g => (
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
          model={this.props.service}
          systemOptions={this.props.systemOptions}
          onSet={::this.setOption}
          onDelete={::this.deleteOption}
        />
      </div>
    );
  }
}
