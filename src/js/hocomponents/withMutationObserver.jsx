import React from 'react';
import compose from 'recompose/compose';

const withMutationObserver: Function = (element: string): Function => (
  Component: React.Element<any>
): React.Element<any> => {
  class WrappedComponent extends React.Component {
    state: {
      lastChange?: string,
    } = {
      lastChange: null,
    };

    _observer: any;

    componentDidMount() {
      this.handleObserverInit(this.props);
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

      if (props.first) {
        this._observer = new MutationObserver(
          (mutations: Array<Object>): void => {
            mutations.forEach(
              (): void => {
                this.setState({ lastChange: new Date() });
              }
            );
          }
        );

        this._observer.observe(document.querySelector(element), {
          attributes: true,
        });
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
