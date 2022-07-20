// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withState from 'recompose/withState';
import Loader from '../../components/loader';
import withDispatch from '../../hocomponents/withDispatch';
import actions from '../../store/api/actions';
import ConcreteLogger from '../ConcreteLogger';
import DefaultLogger from '../DefaultLogger';

type LoggerContainerProps = {};

const LoggerContainer: Function = ({
  // @ts-ignore ts-migrate(2339) FIXME: Property 'isUsingDefaultLogger' does not exist on ... Remove this comment to see the full error message
  isUsingDefaultLogger,
  ...rest
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
LoggerContainerProps) =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'loggerFetched' does not exist on type '{... Remove this comment to see the full error message
  !rest.loggerFetched ? (
    <Loader />
  ) : (
    <React.Fragment>
      {isUsingDefaultLogger ? <DefaultLogger {...rest} /> : <ConcreteLogger {...rest} />}
    </React.Fragment>
  );

export default compose(
  connect((state, ownProps) => {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'isUsingDefaultLogger' does not exist on ... Remove this comment to see the full error message
    const { isUsingDefaultLogger }: any = state.api[ownProps.resource][
      ownProps.resource === 'system' ? 'logs' : 'data'
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    ].find((res: any): boolean => res.id === ownProps.id);

    return {
      isUsingDefaultLogger,
    };
  }),
  withDispatch(),
  withState('loggerFetched', 'setLoggerFetched', false),
  lifecycle({
    async componentDidMount() {
      const { id, resource, dispatchAction, loggerFetched, setLoggerFetched } = this.props;

      if (!loggerFetched) {
        await dispatchAction(actions[resource].fetchLogger, id);
        setLoggerFetched(() => true);
      }
    },
    async componentWillReceiveProps(nextProps: LoggerContainerProps) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'LoggerContai... Remove this comment to see the full error message
      if (this.props.id !== nextProps.id) {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'setLoggerFetched' does not exist on type... Remove this comment to see the full error message
        nextProps.setLoggerFetched(() => false);
      }

      // @ts-ignore ts-migrate(2339) FIXME: Property 'loggerFetched' does not exist on type 'L... Remove this comment to see the full error message
      if (!nextProps.loggerFetched) {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'dispatchAction' does not exist on type '... Remove this comment to see the full error message
        await nextProps.dispatchAction(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'resource' does not exist on type 'Logger... Remove this comment to see the full error message
          actions[nextProps.resource].fetchLogger,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'LoggerContai... Remove this comment to see the full error message
          nextProps.id
        );
        // @ts-ignore ts-migrate(2339) FIXME: Property 'setLoggerFetched' does not exist on type... Remove this comment to see the full error message
        nextProps.setLoggerFetched(() => true);
      }
    },
  }),
  onlyUpdateForKeys(['loggerFetched', 'isUsingDefaultLogger'])
)(LoggerContainer);
