// @flow
import React from 'react';
import { connect } from 'react-redux';
import wrapDisplayName from 'recompose/wrapDisplayName';

export default (
  newTitle: ((props: Object) => string) | string,
  prevTitle: ?string = null,
  position: ?'suffix' | 'prefix' = null
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  @connect(
    (state: Object): Object => ({
      instance: state?.api?.system?.data?.['instance-key'],
    })
  )
  class WrappedComponent extends React.Component {
    props: {
      instance: string,
    } = this.props;

    _baseTitle: string = '| Qorus Integration Engine';

    componentDidMount () {
      this.changeTitle(this.props);
    }

    componentWillReceiveProps (nextProps): void {
      this.changeTitle(nextProps);
    }

    componentWillUnmount () {
      if (prevTitle) {
        document.title = `${prevTitle} ${this._baseTitle}`;
      }
    }

    changeTitle: Function = (props: Object): void => {
      const { instance } = this.props;
      let changedTitle: ?string;
      const newTitleSel =
        typeof newTitle === 'function' ? newTitle(props) : newTitle;

      if (position && position === 'suffix') {
        changedTitle = `${this._baseTitle} ${newTitleSel}`;
      } else {
        changedTitle = `${newTitleSel} ${this._baseTitle}`;
      }

      document.title = instance
        ? `${instance} | ${changedTitle}`
        : changedTitle;
    };

    render () {
      return <Component {...this.props} />;
    }
  }

  WrappedComponent.displayName = wrapDisplayName(Component, 'withTitleManager');

  return WrappedComponent;
};
