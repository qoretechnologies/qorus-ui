// @flow
import React from 'react';
import { connect } from 'react-redux';
import wrapDisplayName from 'recompose/wrapDisplayName';

export default (
  newTitle: ((props: Object) => string) | string,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  prevTitle: ?string = null,
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  position: ?'suffix' | 'prefix' = null
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  @connect(
    (state: Object): Object => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
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
      // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
  WrappedComponent.displayName = wrapDisplayName(Component, 'withTitleManager');

  return WrappedComponent;
};
