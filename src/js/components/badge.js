import React, { Component, PropTypes } from 'react';
import clNs from 'classnames';
import pureRender from 'pure-render-decorator';

@pureRender
class Badge extends Component {
  static propTypes = {
    url: PropTypes.string,
    val: PropTypes.number
  }

  render() {
    let content;
    let cls = { badge: (this.props.val > 0) };
    const label = 'badge-' + this.props.label;
    const { url, val } = this.props;

    cls[label] = (val > 0);

    if (url) {
      content = (
        <a href={url}>
          <span className={clNs(cls)}>{ val }</span>
        </a>
      );
    } else {
      content = <span className={clNs(cls)}>{ val }</span>;
    }

    return (
      content
    );
  }
}

export default Badge;
