import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import HeadbarDivider from './divider';

type Props = {
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  children: Array<React.Element<any>>;
};

class Headbar extends React.Component {
  props: Props = this.props;

  handleRef: Function = (ref: any): void => {
    if (ref) {
      // @ts-ignore ts-migrate(2339) FIXME: Property '_el' does not exist on type 'Headbar'.
      this._el = ref;
    }
  };

  render() {
    const { children } = this.props;

    return (
      <div
        className="headbar"
        // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'LegacyR... Remove this comment to see the full error message
        ref={this.handleRef}
        style={{
          flex: '0 1 auto',
          display: 'flex',
        }}
      >
        {/* @ts-ignore ts-migrate(2349) FIXME: This expression is not callable. */}
        {typeof children === 'function' ? children(this._el) : children}
      </div>
    );
  }
}

export default onlyUpdateForKeys(['children'])(Headbar);
export { HeadbarDivider };
