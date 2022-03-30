import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import ExpandableItem from '../ExpandableItem';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import NoDataIf from '../NoDataIf';
import SourceCode from '../source_code';
import Alert from '../alert';
import { connect } from 'react-redux';
import actions from '../../store/api/actions';

type Props = {
  classes: Array<Object>,
  dependenciesList: Array<string>,
};

type ItemProps = {
  classes: Array<Object>,
  dependency: string,
  classItem: Object,
  show: boolean,
};

let CodeDependencyItem: Function = ({
  classItem,
  show,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: ItemProps): React.Element<ExpandableItem> => (
  <NoDataIf condition={!classItem}>
    {() => (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      <ExpandableItem title={classItem.name} show={show}>
        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
        <SourceCode height={400} language={classItem.language}>
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type 'Object'.
          {classItem.body}
        </SourceCode>
      </ExpandableItem>
    )}
  </NoDataIf>
);

const fetchBodyIfMissing: Function = (): Function => (Component): Function => {
  class WrappedComponent extends React.Component {
    props: {
      classItem: Object,
      fetch: Function,
    } = this.props;

    componentWillMount() {
      const { classItem, fetch } = this.props;

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type 'Object'.
      if (!classItem.body) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'classid' does not exist on type 'Object'... Remove this comment to see the full error message
        fetch({}, classItem.classid);
      }
    }

    render() {
      const { classItem } = this.props;

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type 'Object'.
      if (!classItem.body) {
        return <Alert bsStyle="info">Loading dependency...</Alert>;
      }

      return <Component {...this.props} />;
    }
  }

  return connect(
    null,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'classes' does not exist on type '{}'.
      fetch: actions.classes.fetch,
    }
  )(WrappedComponent);
};

CodeDependencyItem = compose(
  mapProps(
    ({ dependency, classes, ...rest }: ItemProps): ItemProps => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'classid' does not exist on type 'Object'... Remove this comment to see the full error message
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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <div>
    {dependenciesList.map(
      // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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

export default onlyUpdateForKeys(['classes', 'dependenciesList'])(
  CodeDependencies
);
