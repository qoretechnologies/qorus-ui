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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'isUsingDefaultLogger' does not exist on ... Remove this comment to see the full error message
  isUsingDefaultLogger,
  ...rest
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: LoggerContainerProps): React.Element<any> =>
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'loggerFetched' does not exist on type '{... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isUsingDefaultLogger' does not exist on ... Remove this comment to see the full error message
    const { isUsingDefaultLogger }: Object = state.api[ownProps.resource][
      ownProps.resource === 'system' ? 'logs' : 'data'
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    ].find((res: Object): boolean => res.id === ownProps.id);

    return {
      isUsingDefaultLogger,
    };
  }),
  withDispatch(),
  withState('loggerFetched', 'setLoggerFetched', false),
  lifecycle({
    async componentDidMount() {
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
    async componentWillReceiveProps(nextProps: LoggerContainerProps) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'LoggerContai... Remove this comment to see the full error message
      if (this.props.id !== nextProps.id) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'setLoggerFetched' does not exist on type... Remove this comment to see the full error message
        nextProps.setLoggerFetched(() => false);
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'loggerFetched' does not exist on type 'L... Remove this comment to see the full error message
      if (!nextProps.loggerFetched) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
        await nextProps.dispatchAction(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'resource' does not exist on type 'Logger... Remove this comment to see the full error message
          actions[nextProps.resource].fetchLogger,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'LoggerContai... Remove this comment to see the full error message
          nextProps.id
        );
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'setLoggerFetched' does not exist on type... Remove this comment to see the full error message
        nextProps.setLoggerFetched(() => true);
      }
    },
  }),
  onlyUpdateForKeys(['loggerFetched', 'isUsingDefaultLogger'])
)(LoggerContainer);
