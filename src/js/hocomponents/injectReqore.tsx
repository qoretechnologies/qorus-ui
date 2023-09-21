/* @flow */
import { useReqoreProperty } from '@qoretechnologies/reqore';
import { IReqoreContext } from '@qoretechnologies/reqore/dist/context/ReqoreContext';

/**
 * A high-order component that provides an easy access to
 * opening and closing a modal
 */
export default (
    reqoreProperty?: keyof IReqoreContext
  ): Function =>
  (Component) => {
    return (props) => {
      const property = useReqoreProperty(reqoreProperty);

      return <Component {...{
        ...props,
        [reqoreProperty]: property
      }} />;
    };
  };
