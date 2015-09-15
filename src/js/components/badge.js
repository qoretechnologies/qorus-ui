import React, { Component, PropTypes } from 'react';
import clNs from 'classnames';
import pureRender from 'pure-render-decorator';

@pureRender
class Badge extends Component {
  static propTypes = {
    url: PropTypes.string,
    val: PropTypes.number,
    label: PropTypes.string
  }

  static defaultProps = {
    label: ''
  }

  render() {
    let content;
    let cls;
    const { url, val, label } = this.props;

    cls = { badge: (val > 0) };

    if (label && val > 0) {
      const lbl = `badge-${label}`;
      cls[lbl] = true;
    }

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
