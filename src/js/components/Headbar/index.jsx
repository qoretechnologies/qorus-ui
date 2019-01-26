import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import HeadbarDivider from './divider';

type Props = {
  children: Array<React.Element<any>>,
};

class Headbar extends React.Component {
  props: Props = this.props;

  handleRef: Function = (ref: any): void => {
    if (ref) {
      this._el = ref;
    }
  };

  render () {
    const { children } = this.props;

    return (
      <div
        className="headbar"
        ref={this.handleRef}
        style={{
          flex: '0 1 auto',
        }}
      >
        {typeof children === 'function' ? children(this._el) : children}
      </div>
    );
  }
}

export default onlyUpdateForKeys(['children'])(Headbar);
export { HeadbarDivider };
