// @flow
import debounce from 'lodash/debounce';
import moment from 'moment';
import React, { Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import Datepicker from '../../../components/datepicker';
import { DATE_FORMATS } from '../../../constants/dates';
import { formatDate } from '../../../helpers/date';
import queryControl from '../../../hocomponents/queryControl';

type Props = {
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  fileNameQuery: string;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  componentQuery: string;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  maxdateQuery: string;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  mindateQuery: string;
  changeAllQuery: Function;
  compact: boolean;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  component: string;
};

class ReleasesSearch extends Component {
  props: Props = this.props;

  state: {
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    fileName: string;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    component: string;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    maxdate: string;
    // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    mindate: string;
  } = {
    fileName: this.props.fileNameQuery,
    component: this.props.componentQuery,
    maxdate: this.props.maxdateQuery,
    mindate: this.props.mindateQuery,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props !== nextProps) {
      this.setState({
        mindate: nextProps.mindateQuery,
        maxdate: nextProps.maxdateQuery,
        fileName: nextProps.fileNameQuery,
        component: nextProps.componentQuery,
      });
    }
  }

  componentDidUpdate(prevProps: Object, prevState: Object) {
    if (prevState !== this.state) {
      this._delayedSearch(this.state);
    }
  }

  _delayedSearch: Function = debounce((data: Object) => {
    this.props.changeAllQuery(data);
  }, 280);

  handleFileChange: Function = (event: Object): void => {
    this.setState({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
      fileName: event.target.value,
    });
  };

  handleCompChange: Function = (event: Object): void => {
    this.setState({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'target' does not exist on type 'Object'.
      component: event.target.value,
    });
  };

  handleMaxdateChange: Function = (date: string): void => {
    if (date && date !== '') {
      const maxdate = formatDate(date);

      this.setState({
        maxdate: moment(maxdate).format(DATE_FORMATS.URL_FORMAT),
      });
    } else {
      this.setState({
        maxdate: '',
      });
    }
  };

  handleMindateChange: Function = (date: string): void => {
    if (date && date !== '') {
      const mindate = formatDate(date);

      this.setState({
        mindate: moment(mindate).format(DATE_FORMATS.URL_FORMAT),
      });
    } else {
      this.setState({
        mindate: '',
      });
    }
  };

  render() {
    return (
      <div className="pull-right">
        <div className="form-group search-toolbar">
          <div className="pull-left bp3-control-group">
            <input
              className="bp3-input search-input"
              type="text"
              placeholder="File name..."
              // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'ChangeE... Remove this comment to see the full error message
              onChange={this.handleFileChange}
              value={this.state.fileName || ''}
              id="filename"
              name="filename"
            />
            <input
              className="bp3-input search-input"
              type="text"
              placeholder="Component..."
              // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'ChangeE... Remove this comment to see the full error message
              onChange={this.handleCompChange}
              value={this.state.component || ''}
              id="component"
              name="component"
            />
          </div>
          <div className="pull-left">
            <Datepicker
              placeholder="Min date..."
              date={this.state.mindate}
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              onApplyDate={this.handleMindateChange}
              applyOnBlur
              id="mindate"
              name="mindate"
            />
          </div>
          <div className="pull-left">
            <Datepicker
              placeholder="Max date..."
              date={this.state.maxdate}
              // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
              onApplyDate={this.handleMaxdateChange}
              applyOnBlur
              noButtons
              id="maxdate"
              name="maxdate"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
  queryControl(),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('fileName'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('component'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('maxdate'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('mindate'),
  pure(['fileNameQuery', 'componentQuery', 'maxdateQuery', 'mindateQuery'])
)(ReleasesSearch);
