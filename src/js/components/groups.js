import React, { Component, PropTypes } from 'react';
import clNs from 'classnames';
import { pureRender } from './utils';

@pureRender
class GroupItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired
  }

  render() {
    const { name, size, url, enabled } = this.props;
    const cls = clNs({
      label: true,
      'label-info': enabled
    });

    return (
      <a href={ url } >
        <span className={ cls }>{ name } <small>({ size })</small></span>
      </a>
    );
  }
}

@pureRender
class GroupsView extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.shape(GroupItem.propTypes)).isRequired
  }

  render() {
    return (
      <div>
        <h4>Groups</h4>
        {
          this.props.groups.map(g => (
            <GroupItem
              key={ g.name }
              name={ g.name }
              size={ g.size }
              url={ g.url }
              enabled={ g.enabled } />
          ))
        }
      </div>
    );
  }
}

export default GroupsView;
