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
  isUsingDefaultLogger ? (
    <DefaultLogger {...rest} />
  ) : (
    <ConcreteLogger {...rest} />
  );

export default compose(
  connect((state, ownProps) => {
    let { isUsingDefaultLogger, loggerData }: Object = state.api[
      ownProps.resource
    ][ownProps.resource === 'system' ? 'logs' : 'data'].find(
      (res: Object): boolean => res.id === ownProps.id
    );

    console.log(isUsingDefaultLogger);

    return {
      isUsingDefaultLogger,
      loggerData,
    };
  }),
  withDispatch(),
  lifecycle({
    async componentDidMount () {
      const { id, resource, dispatchAction, loggerData } = this.props;

      if (!loggerData) {
        dispatchAction(actions[resource].fetchLogger, id);
      }
    },
    componentWillReceiveProps (nextProps: LoggerContainerProps) {
      if (this.props.id !== nextProps.id) {
        nextProps.dispatchAction(
          actions[nextProps.resource].fetchLogger,
          nextProps.id
        );
      }
    },
  }),
  showIfPassed(({ loggerData }) => loggerData, <Loader />),
  onlyUpdateForKeys(['id', 'loggerData', 'isUsingDefaultLogger'])
)(LoggerContainer);
