import React, { Component, PropTypes } from 'react';
import { Controls, Control } from 'components/controls';


import classNames from 'classnames';
import { fetchJson } from 'store/api/utils';
import settings from 'settings';
import { pureRender } from 'components/utils';


const MAX_TRIES = 10;


@pureRender
export default class LibraryTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  };


  constructor(props) {
    super(props);

    this._token = null;
    this._socket = null;
    this._scroll = null;

    this.toggleAutoscroll = this.toggleAutoscroll.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.checkAutoscroll = this.checkAutoscroll.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.toggleReFilter = this.toggleReFilter.bind(this);
  }


  componentWillMount() {
    this.setState({
      log: [],
      filteredLog: [],
      filterPlain: '',
      filterRe: null,
      isFilterRe: false,
      autoscroll: true,
      pause: false,
      error: null
    });
    this.connect();
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.workflow.workflowid === nextProps.workflow.workflowid) {
      return;
    }

    this.disconnect();

    this.setState({
      log: [],
      filteredLog: [],
      error: null
    });
    this.connect();
  }


  componentDidUpdate() {
    if (this.state.autoscroll) {
      this._scroll.scrollTop =
        this._scroll.scrollHeight - this._scroll.clientHeight;
    }
  }


  componentWillUnmount() {
    this.disconnect();
  }


  onSubmit(ev) {
    ev.preventDefault();
  }


  onFilter(ev) {
    let filterRe;
    try {
      filterRe = new RegExp(ev.currentTarget.value);
    } catch (e) {
      filterRe = this.state.filterRe;
    }

    this.setState({
      filterPlain: ev.currentTarget.value,
      filterRe
    });

    this.applyFilter();
  }


  getLogName() {
    const basename = this.props.workflow.name ?
      this.props.workflow.name.toLowerCase() :
      `workflow-${this.props.workflow.workflowid}`;

    return `${basename}.log`;
  }


  getLogUri() {
    return 'data:' +
      'text/plain;' +
      'base64,' +
      window.btoa(
        this.state.filteredLog.
          map(({ line }) => line).
          join('\n')
      );
  }


  addChunk(chunk) {
    const logLines = chunk.
      split(/\n/).
      map((line, delta) => ({
        line,
        no: this.state.log.length + delta
      }));

    this.setState({
      log: this.state.log.concat(
        logLines
      ),
      filteredLog: this.state.filteredLog.concat(
        logLines.filter(::this.filterLogLine)
      )
    });
  }


  chunkReceived(ev) {
    if (this.state.pause) return;

    this.addChunk(ev.data);
  }


  socketError(ev) {
    this.setState({ error: ev });
    this.disconnect();
  }


  toggleAutoscroll() {
    this.setState({ autoscroll: !this.state.autoscroll });
  }


  checkAutoscroll() {
    if (!this.state.autoscroll) return;

    if (this._scroll.scrollTop <
        this._scroll.scrollHeight - this._scroll.clientHeight) {
      this.setState({ autoscroll: false });
    }
  }


  togglePause() {
    if (!this.state.pause) {
      this.setState({ pause: true });
      this.addChunk('-- Paused --');
    } else {
      this.addChunk('-- Continue --');
      this.setState({ pause: false });
    }
  }


  applyFilter() {
    this.setState({
      filteredLog: this.state.log.filter(::this.filterLogLine)
    });
  }


  toggleReFilter() {
    this.setState({
      isFilterRe: !this.state.isFilterRe
    });
  }


  filterLogLine({ line }) {
    return this.state.isFilterRe ?
      (line.match(this.state.filterRe) !== null) :
      (line.indexOf(this.state.filterPlain) >= 0);
  }


  async connect(tries = 0) {
    if (tries >= MAX_TRIES) {
      this.setState({ error: 'Connection dropped.' });
      this.disconnect();
      return;
    }

    if (!this._token) {
      try {
        this._token = await fetchJson(
          'GET',
          `${settings.REST_API_PREFIX}/system?action=wstoken`
        );
      } catch (e) {
        this._token = null;
        this.setState({ error: e });
        return;
      }
    }

    if (this._socket) this.disconnect();
    this._socket = new WebSocket(
      settings.WS_API_PREFIX +
      `/log/workflows/${this.props.workflow.workflowid}` +
      `?token=${this._token}`
    );
    this._socket.onmessage = this.chunkReceived.bind(this);
    this._socket.onclose = this.connect.bind(this, tries + 1);
    this._socket.onerror = this.socketError.bind(this);
  }


  disconnect() {
    if (!this._socket) return;

    this._socket.onerror = null;
    this._socket.onclose = null;
    this._socket.close();
    this._socket = null;
    this._token = null;
  }


  renderLogLine({ line, no }) {
    return (
      <div key={ no }>{ line }</div>
    );
  }


  renderLog() {
    return this.state.filteredLog.map(::this.renderLogLine);
  }


  render() {
    const refScroll = c => this._scroll = c;

    return (
      <div>
        <div className='row'>
          <div className='col-sm-6'>
            <Controls>
              <Control
                label='Autoscroll'
                btnStyle={this.state.autoscroll ? 'success' : null}
                icon='check'
                action={this.toggleAutoscroll}
              />
              <Control
                label='Pause'
                btnStyle={this.state.pause ? 'success' : null}
                icon='pause'
                action={this.togglePause}
              />
            </Controls>
          </div>
          <div className='col-sm-6'>
            <form
              className='form-inline text-right form-filter'
              onSubmit={this.onSubmit}
            >
              <div className='form-group'>
                <label
                  className={classNames({
                    btn: true,
                    'btn-default': !this.state.isFilterRe,
                    'btn-xs': true,
                    'form-filter__mod': true,
                    'btn-success': this.state.isFilterRe
                  })}
                >
                  RE
                  <input
                    type='checkbox'
                    className='sr-only'
                    checked={this.state.isFilterRe}
                    onChange={this.toggleReFilter}
                  />
                </label>
                <input
                  type='search'
                  className='form-control form-filter__field'
                  placeholder='Filter…'
                  value={this.state.filterPlain}
                  onChange={this.onFilter}
                />
                <button
                  type='submit'
                  className='btn btn-default btn-xs form-filter__btn'
                >
                  <i className='fa fa-search' />
                </button>
                {' '}
                <a
                  href={this.getLogUri()}
                  download={this.getLogName()}
                  className='btn btn-default btn-xs'
                  role='button'
                >
                  <i className='fa fa-download' />
                </a>
              </div>
            </form>
          </div>
        </div>
        {this.state.error && (
          <div className='alert alert-danger' role='alert'>
            {'' + this.state.error}
          </div>
        )}
        <div className='log-area'>
          <pre
            className='language-log'
            ref={refScroll}
            onScroll={this.checkAutoscroll}
          >
            <code className='language-log'>{this.renderLog()}</code>
          </pre>
        </div>
      </div>
    );
  }
}
