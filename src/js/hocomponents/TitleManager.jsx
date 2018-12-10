// @flow
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

export default (
  newTitle: ((props: Object) => string) | string,
  prevTitle: ?string = null,
  position: ?'suffix' | 'prefix' = null
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  class WrappedComponent extends React.Component {
    _baseTitle: string = '| Qorus Integration Engine';

    componentDidMount() {
      this.changeTitle(this.props);
    }

    componentWillReceiveProps(nextProps): void {
      this.changeTitle(nextProps);
    }

    componentWillUnmount() {
      if (prevTitle) {
        document.title = `${prevTitle} ${this._baseTitle}`;
      }
    }

    changeTitle: Function = (props: Object): void => {
      let changedTitle: ?string;
      const newTitleSel =
        typeof newTitle === 'function' ? newTitle(props) : newTitle;

      if (position) {
        if (position === 'suffix') {
          changedTitle = `${document.title} | ${newTitleSel}`;
        } else {
          changedTitle = `${newTitleSel} | ${document.title}`;
        }
      } else {
        changedTitle = newTitleSel;
      }

      document.title = `${changedTitle} ${this._baseTitle}`;
    };

    render() {
      return <Component {...this.props} />;
    }
  }

  WrappedComponent.displayName = wrapDisplayName(Component, 'withTitleManager');

  return WrappedComponent;
};
