import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import actions from '../../store/api/actions';
import Alert from '../alert';
import ExpandableItem from '../ExpandableItem';
import NoDataIf from '../NoDataIf';
import SourceCode from '../source_code';

type Props = {
  classes: Array<Object>;
  dependenciesList: Array<string>;
};

type ItemProps = {
  classes: Array<Object>;
  dependency: string;
  classItem: Object;
  show: boolean;
};

let CodeDependencyItem: Function = ({
  classItem,
  show,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ItemProps): React.Element<ExpandableItem> => (
  <NoDataIf condition={!classItem}>
    {() => (
      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      <ExpandableItem title={classItem.name} show={show}>
        {/* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */}
        <SourceCode height={400} language={classItem.language}>
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type 'Object'. */}
          {classItem.body}
        </SourceCode>
      </ExpandableItem>
    )}
  </NoDataIf>
);

const fetchBodyIfMissing: Function =
  (): Function =>
  (Component): Function => {
    class WrappedComponent extends React.Component {
      props: {
        classItem: Object;
        fetch: Function;
      } = this.props;

      componentWillMount() {
        const { classItem, fetch } = this.props;

        // @ts-ignore ts-migrate(2339) FIXME: Property 'body' does not exist on type 'Object'.
        if (!classItem.body) {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'classid' does not exist on type 'Object'... Remove this comment to see the full error message
          fetch({}, classItem.classid);
        }
      }

      render() {
        const { classItem } = this.props;

        // @ts-ignore ts-migrate(2339) FIXME: Property 'body' does not exist on type 'Object'.
        if (!classItem.body) {
          return <Alert bsStyle="info">Loading dependency...</Alert>;
        }

        return <Component {...this.props} />;
      }
    }

    return connect(null, {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'classes' does not exist on type '{}'.
      fetch: actions.classes.fetch,
    })(WrappedComponent);
  };

CodeDependencyItem = compose(
  mapProps(
    ({ dependency, classes, ...rest }: ItemProps): ItemProps => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'classid' does not exist on type 'Object'... Remove this comment to see the full error message
      classItem: classes.find((cls: Object) => cls.classid === dependency),
      dependency,
      classes,
      ...rest,
    })
  ),
  fetchBodyIfMissing(),
  onlyUpdateForKeys(['dependency', 'classes'])
)(CodeDependencyItem);

const CodeDependencies: Function = ({
  classes,
  dependenciesList,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <div>
    {dependenciesList.map(
      // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
      (dependency: string): React.Element<CodeDependencyItem> => (
        <CodeDependencyItem
          key={dependency}
          dependency={dependency}
          classes={classes}
          show={dependenciesList.length === 1}
        />
      )
    )}
  </div>
);

export default onlyUpdateForKeys(['classes', 'dependenciesList'])(CodeDependencies);
