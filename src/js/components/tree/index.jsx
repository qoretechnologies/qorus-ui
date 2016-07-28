import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Control as Button } from '../controls';

export default class Tree extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
  };

  componentWillMount() {
    this.setState({
      copy: false,
    });
  }

  componentDidUpdate() {
    if (this.state.copy && document.getElementById('tree-content')) {
      document.getElementById('tree-content').select();
    }
  }

  handleClick = () => {
    this.setState({
      copy: !this.state.copy,
    });
  };

  renderTree(data, top) {
    return Object.keys(data).map((key, index) => {
      const wrapperClass = classNames({
        'tree-top': top,
        last: typeof data[key] !== 'object' || data[key] === null,
      });

      return (
        <div
          key={index}
          className={wrapperClass}
        >
          <span
            className={typeof data[key] === 'object' && data[key] !== null ?
              'expand' :
              ''
            }
          >
            {key}:
          </span>
          {' '}
          {typeof data[key] === 'object' && data[key] !== null ?
            this.renderTree(data[key], false) :
            data[key]
          }
        </div>
      );
    });
  }

  renderText(data, tabs = '') {
    let text = '';

    Object.keys(data).forEach(key => {
      if (typeof data[key] !== 'object' || !data[key]) {
        text += `${tabs}${key}: ${data[key]}\r\n`;
      } else {
        text += `${tabs}${key}:\r\n`;
        text += this.renderText(data[key], `${tabs}\t`);
      }
    });

    return text;
  }

  render() {
    const { data } = this.props;

    if (!data || !Object.keys(data).length) return <p> No data </p>;

    return (
      <div>
        {!this.state.copy &&
          <div className="tree-wrapper pull-left" ref="tree">
            { this.renderTree(this.props.data, true) }
          </div>
        }
        {this.state.copy &&
          <textarea
            id="tree-content"
            className="form-control"
            defaultValue={this.renderText(this.props.data)}
            rows="20"
            cols="50"
          />
        }
        <div className="pull-right">
          <Button
            label={this.state.copy ? 'Tree View' : 'Copy view'}
            big
            btnStyle="info"
            action={this.handleClick}
            className="button--copy"
          />
        </div>
      </div>
    );
  }
}
