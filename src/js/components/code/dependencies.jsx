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
}: ItemProps): React.Element<ExpandableItem> => (
  <NoDataIf condition={!classItem}>
    {() => (
      <ExpandableItem title={classItem.name} show={show}>
        <SourceCode height={400} language={classItem.language}>
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

      if (!classItem.body) {
        fetch({}, classItem.classid);
      }
    }

    render() {
      const { classItem } = this.props;

      if (!classItem.body) {
        return <Alert bsStyle="info">Loading dependency...</Alert>;
      }

      return <Component {...this.props} />;
    }
  }

  return connect(
    null,
    {
      fetch: actions.classes.fetch,
    }
  )(WrappedComponent);
};

CodeDependencyItem = compose(
  mapProps(
    ({ dependency, classes, ...rest }: ItemProps): ItemProps => ({
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
}: Props): React.Element<any> => (
  <div>
    {dependenciesList.map(
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
