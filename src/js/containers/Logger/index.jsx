// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import lifecycle from 'recompose/lifecycle';
import actions from '../../store/api/actions';
import showIfPassed from '../../hocomponents/show-if-passed';
import Loader from '../../components/loader';
import withDispatch from '../../hocomponents/withDispatch';
import withState from 'recompose/withState';
import DefaultLogger from '../DefaultLogger';
import ConcreteLogger from '../ConcreteLogger';
import { connect } from 'react-redux';

type LoggerContainerProps = {};

const LoggerContainer: Function = ({
  isUsingDefaultLogger,
  ...rest
}: LoggerContainerProps): React.Element<any> =>
  !rest.loggerFetched ? (
    <Loader />
  ) : (
    <React.Fragment>
      {isUsingDefaultLogger ? (
        <DefaultLogger {...rest} />
      ) : (
        <ConcreteLogger {...rest} />
      )}
    </React.Fragment>
  );

export default compose(
  connect((state, ownProps) => {
    const { isUsingDefaultLogger }: Object = state.api[ownProps.resource][
      ownProps.resource === 'system' ? 'logs' : 'data'
    ].find((res: Object): boolean => res.id === ownProps.id);

    return {
      isUsingDefaultLogger,
    };
  }),
  withDispatch(),
  withState('loggerFetched', 'setLoggerFetched', false),
  lifecycle({
    async componentDidMount () {
      const {
        id,
        resource,
        dispatchAction,
        loggerFetched,
        setLoggerFetched,
      } = this.props;

      if (!loggerFetched) {
        await dispatchAction(actions[resource].fetchLogger, id);
        setLoggerFetched(() => true);
      }
    },
    async componentWillReceiveProps (nextProps: LoggerContainerProps) {
      if (this.props.id !== nextProps.id) {
        nextProps.setLoggerFetched(() => false);
      }

      if (!nextProps.loggerFetched) {
        await nextProps.dispatchAction(
          actions[nextProps.resource].fetchLogger,
          nextProps.id
        );
        nextProps.setLoggerFetched(() => true);
      }
    },
  }),
  onlyUpdateForKeys(['loggerFetched', 'isUsingDefaultLogger'])
)(LoggerContainer);
