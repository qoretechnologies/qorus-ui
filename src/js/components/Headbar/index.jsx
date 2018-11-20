import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import shortid from 'shortid';
import { connect } from 'react-redux';

type Props = {
  children: Array<React.Element<any>>,
  width: number,
};

@connect(
  (state: Object): Object => ({
    width: state.ui.settings.width,
  })
)
class Headbar extends React.Component {
  props: Props;

  _el: any;
  _id: string = shortid.generate();
  _observer: any;

  state = {
    lastMutation: this.props.width,
  };

  handleRef: Function = (ref: any): void => {
    if (ref) {
      this._el = ref;
    }
  };

  componentDidMount() {
    this._observer = new MutationObserver(
      (): void => {
        this.setState({ lastMutation: new Date() });
      }
    );

    this._observer.observe(document.querySelector(`#headbar_${this._id}`), {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.width !== nextProps.width) {
      this.setState({ lastMutation: new Date() });
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div
        id={`headbar_${this._id}`}
        key={this.state.lastMutation}
        className="headbar"
        ref={this.handleRef}
      >
        {typeof children === 'function' ? children(this._el) : children}
      </div>
    );
  }
}

export default onlyUpdateForKeys(['children', 'width'])(Headbar);
