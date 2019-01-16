import React from 'react';
import { functionOrStringExp } from '../helpers/functions';

const withMutationObserver: Function = (
  element: string | Function
): Function => (Component: React.Element<any>): React.Element<any> => {
  class WrappedComponent extends React.Component {
    props: {
      first?: boolean,
    } = this.props;

    state: {
      lastChange?: string,
    } = {
      lastChange: null,
    };

    _observer: any;

    componentDidMount() {
      if (this.props.first) {
        this.handleObserverInit(this.props);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.first !== nextProps.first) {
        this.handleObserverInit(nextProps);
      }
    }

    componentWillUnmount() {
      this.handleObserverDisconnect();
    }

    handleObserverInit: Function = props => {
      this.handleObserverDisconnect();
      const domElement: any = functionOrStringExp(element, props);

      if (props.first && domElement) {
        const el = document.querySelector(domElement);

        if (el) {
          this._observer = new MutationObserver(
            (mutations: Array<Object>): void => {
              mutations.forEach(
                (): void => {
                  this.setState({ lastChange: new Date() });
                }
              );
            }
          );

          this._observer.observe(el, {
            attributes: true,
          });
        }
      }
    };

    handleObserverDisconnect: Function = (): void => {
      if (this._observer) {
        this._observer.disconnect();
      }
    };

    render() {
      return (
        <Component {...this.props} lastObserverChange={this.state.lastChange} />
      );
    }
  }

  return WrappedComponent;
};

export default withMutationObserver;
