// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import debounce from 'lodash/debounce';
import moment from 'moment';

import queryControl from '../../../hocomponents/queryControl';
import Datepicker from '../../../components/datepicker';
import { formatDate } from '../../../helpers/date';
import { DATE_FORMATS } from '../../../constants/dates';

type Props = {
  fileNameQuery: ?string,
  componentQuery: ?string,
  maxdateQuery: ?string,
  mindateQuery: ?string,
  changeAllQuery: Function,
  compact: boolean,
  component: ?string,
};

class ReleasesSearch extends Component {
  props: Props;

  state: {
    fileName: ?string,
    component: ?string,
    maxdate: ?string,
    mindate: ?string,
  } = {
    fileName: this.props.fileNameQuery,
    component: this.props.componentQuery,
    maxdate: this.props.maxdateQuery,
    mindate: this.props.mindateQuery,
  }

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
      fileName: event.target.value,
    });
  }

  handleCompChange: Function = (event: Object): void => {
    this.setState({
      component: event.target.value,
    });
  }

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
  }

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
  }

  render() {
    return (
      <div className="pull-right">
        <div className="form-group search-toolbar">
          <div className="pull-left">
            <input
              className="form-control search-input"
              type="text"
              placeholder="File name..."
              onChange={this.handleFileChange}
              value={this.state.fileName || ''}
              id="filename"
              name="filename"
            />
          </div>
          <div className="pull-left">
            <input
              className="form-control search-input"
              type="text"
              placeholder="Component..."
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
  queryControl(),
  queryControl('fileName'),
  queryControl('component'),
  queryControl('maxdate'),
  queryControl('mindate'),
  pure([
    'fileNameQuery',
    'componentQuery',
    'maxdateQuery',
    'mindateQuery',
  ])
)(ReleasesSearch);
