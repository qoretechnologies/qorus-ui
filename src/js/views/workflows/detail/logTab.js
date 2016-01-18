import React, { Component, PropTypes } from 'react';
import { Controls, Control } from 'components/controls';


import classNames from 'classnames';
import { fetchJson } from 'store/api/utils';
import settings from 'settings';
import { pureRender } from 'components/utils';


/**
 * Maximum of reconnect tries to log Web Socket.
 */
const MAX_TRIES = 10;


/**
 * Log buffer and controls to manipulate it.
 *
 * This tab has following key features:
 *
 * - autoscroll which keeps buffer scroll position at the bottom
 * - pause which stops receiving new log entries
 * - filter which greps log entries and highlights matches
 * - download of currently visible log buffer (with filter applied)
 */
// TODO refactor Web Sockets code to store.
@pureRender
export default class LogTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired
  };


  /**
   * Prepares internal state.
   *
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this._token = null;
    this._socket = null;
    this._scroll = null;
  }


  /**
   * Initializes default state and connects to log Web Socket.
   *
   * @see connect
   */
  componentWillMount() {
    this.setState({
      entries: [],
      filteredEntries: [],
      filterSource: '',
      filter: new RegExp('', 'g'),
      filterError: null,
      isFilterRe: false,
      autoscroll: true,
      pause: false,
      error: null
    });
    this.connect(this.props.workflow);
  }


  /**
   * Resets log and connects to different log Web Socket.
   *
   * This happens only if workflow changes.
   *
   * @param {object} nextProps
   * @see connect
   * @see disconnect
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.workflow.workflowid === nextProps.workflow.workflowid) {
      return;
    }

    this.disconnect();

    this.setState({
      entries: [],
      filteredEntries: [],
      error: null
    });
    this.connect(nextProps.workflow);
  }


  /**
   * Keeps log buffer scroll position at the bottom.
   *
   * This happens only if autoscroll is enabled.
   */
  componentDidUpdate() {
    if (this.state.autoscroll) {
      this._scroll.scrollTop =
        this._scroll.scrollHeight - this._scroll.clientHeight;
    }
  }


  /**
   * Disconnects from log Web Socket.
   *
   * @see disconnect
   */
  componentWillUnmount() {
    this.disconnect();
  }


  /**
   * Prevents filter form submit.
   *
   * @param {Event} ev
   */
  onSubmit(ev) {
    ev.preventDefault();
  }


  /**
   * Toggles autoscroll.
   */
  onAutoscrollToggle() {
    this.setState({ autoscroll: !this.state.autoscroll });
  }


  /**
   * Toggle pause and adds a status message to the buffer.
   */
  onPauseToggle() {
    if (!this.state.pause) {
      this.setState({ pause: true });
      this.addEntries('-- Paused --');
    } else {
      this.setState({ pause: false });
      this.addEntries('-- Continue --');
    }
  }


  /**
   * Changes filter based on new input as a source.
   *
   * The filter is also applied on the buffer.
   *
   * @param {Event} ev
   */
  onFilterSourceChange(ev) {
    const filterSource = ev.currentTarget.value;
    const [filter, filterError] = this.filterFromSource(
      this.state.isFilterRe, filterSource
    );
    const filteredEntries = this.state.entries.filter(
      this.filterEntry.bind(this, filter)
    );

    this.setState({ filterSource, filter, filterError, filteredEntries });
  }


  /**
   * Toggle indicator of filter source being treated as RegExp.
   *
   * The filter is changed and then applied on the buffer.
   */
  onReFilterToggle() {
    const isFilterRe = !this.state.isFilterRe;
    const [filter, filterError] = this.filterFromSource(
      isFilterRe, this.state.filterSource
    );
    const filteredEntries = this.state.entries.filter(
      this.filterEntry.bind(this, filter)
    );

    this.setState({ isFilterRe, filter, filterError, filteredEntries });
  }


  /**
   * Disables autoscroll if scroll to the top is detected.
   *
   * @param {Event} ev
   */
  onBufferScroll(ev) {
    if (!this.state.autoscroll) return;

    if (ev.currentTarget.scrollTop <
        ev.currentTarget.scrollHeight - ev.currentTarget.clientHeight) {
      this.setState({ autoscroll: false });
    }
  }


  /**
   * Appends newly received log entries if not paused.
   *
   * @param {Event} ev
   * @see addEntries
   */
  onSocketMessage(ev) {
    if (this.state.pause) return;

    this.addEntries(ev.data);
  }


  /**
   * Stores Web Socket error and disconnects.
   *
   * @param {Event} ev
   * @see disconnect
   */
  onSocketError(ev) {
    this.setState({ error: ev });
    this.disconnect();
  }


  /**
   * Returns log filename based on workflow name (or ID).
   *
   * @return {string}
   */
  getLogName() {
    const basename = this.props.workflow.name ?
      this.props.workflow.name.toLowerCase() :
      `workflow-${this.props.workflow.workflowid}`;

    return `${basename}.log`;
  }


  /**
   * Returns log buffer as a data URI.
   *
   * @return {string}
   */
  getLogUri() {
    return 'data:' +
      'text/plain;' +
      'base64,' +
      window.btoa(
        this.state.filteredEntries.
          map(({ entry }) => entry).
          join('\n')
      );
  }


  /**
   * Creates new filter RegExp.
   *
   * @param {boolean} isFilterRe treat filter source as a RegExp
   * @param {string} filterSource
   * @return {RegExp}
   */
  filterFromSource(isFilterRe, filterSource) {
    let source;
    if (isFilterRe) {
      source = filterSource;
    } else {
      source = filterSource.
        replace(/\\/g, '\\\\').
        replace(/\./g, '\\.').
        replace(/\*/g, '\\*').
        replace(/\+/g, '\\+').
        replace(/\?/g, '\\?').
        replace(/\[/g, '\\[').
        replace(/\(/g, '\\(').
        replace(/\{/g, '\\{').
        replace(/\|/g, '\\|').
        replace(/^\^/g, '\\^').
        replace(/\$$/g, '\\$');
    }

    let filter;
    let filterError = null;
    while (!filter && source) {
      try {
        filter = new RegExp(source, 'g');
      } catch (e) {
        if (!filterError) filterError = e;

        source = source.substring(0, source.length - 1);
      }
    }

    if (!filter) filter = new RegExp('', 'g');

    return [filter, filterError];
  }


  /**
   * Appends new log entries to the buffer.
   *
   * @param {string} chunk
   */
  addEntries(chunk) {
    const entries = chunk.
      split(/\n/).
      map((entry, delta) => ({
        entry,
        no: this.state.entries.length + delta
      }));

    this.setState({
      entries: this.state.entries.concat(
        entries
      ),
      filteredEntries: this.state.filteredEntries.concat(
        entries.filter(this.filterEntry.bind(this, this.state.filter))
      )
    });
  }


  /**
   * Checks if log entry complies with current filter.
   *
   * @param {RegExp} filter
   * @param {string} entry
   * @return {boolean}
   */
  filterEntry(filter, { entry }) {
    return (new RegExp(filter)).test(entry);
  }


  /**
   * Connects to log Web Socket for given workflow.
   *
   * Opened Web Socket tries to reconnect on sudden connection
   * close. It does so by calling this method with number of tries
   * increased. If number of tries is higher then {@link MAX_TRIES},
   * it stops.
   *
   * @param {{ workflowid: string }} workflow
   * @param {number=} tries
   * @see disconnect
   * @see onSocketMessage
   * @see onSocketError
   */
  async connect(workflow, tries = 0) {
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
      `/log/workflows/${workflow.workflowid}` +
      `?token=${this._token}`
    );
    this._socket.onmessage = ::this.onSocketMessage;
    this._socket.onclose = this.connect.bind(this, workflow, tries + 1);
    this._socket.onerror = ::this.onSocketError;
  }


  /**
   * Removes event handlers and closes current log Web Socket.
   */
  disconnect() {
    if (!this._socket) return;

    this._socket.onerror = null;
    this._socket.onclose = null;
    this._socket.close();
    this._socket = null;
    this._token = null;
  }


  /**
   * Returns element for given log entry.
   *
   * It finds and highlights matches for current filter.
   *
   * @param {string} entry
   * @param {number} no
   * @return {ReactElement}
   */
  renderEntry({ entry, no }) {
    const filter = new RegExp(this.state.filter);
    const parts = [];

    let prevIndex = filter.lastIndex;
    for (let match = filter.exec(entry);
         match !== null && match.index !== filter.lastIndex;
         match = filter.exec(entry)) {
      if (prevIndex < match.index) {
        parts.push({
          start: prevIndex,
          end: match.index,
          highlight: false
        });
      }

      parts.push({
        start: match.index,
        end: filter.lastIndex,
        highlight: true
      });

      prevIndex = filter.lastIndex;
    }

    if (prevIndex < entry.length) {
      parts.push({
        start: prevIndex,
        end: entry.length,
        highlight: false
      });
    }

    return (
      <div key={ no }>
        {parts.map(({ start, end, highlight }) => (
          highlight ? (
            <b key={`${start}.${end}`} className='highlight'>
              {entry.substring(start, end)}
            </b>
          ) : (
            <span key={`${start}.${end}`}>
              {entry.substring(start, end)}
            </span>
          )
        ))}
      </div>
    );
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
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
                action={::this.onAutoscrollToggle}
              />
              <Control
                label='Pause'
                btnStyle={this.state.pause ? 'success' : null}
                icon='pause'
                action={::this.onPauseToggle}
              />
            </Controls>
          </div>
          <div className='col-sm-6'>
            <form
              className='form-inline text-right form-filter'
              onSubmit={::this.onSubmit}
            >
              <div
                className={classNames({
                  'form-group': true,
                  'has-error': this.state.filterError
                })}
              >
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
                    onChange={::this.onReFilterToggle}
                  />
                </label>
                <input
                  type='search'
                  className='form-control form-filter__field'
                  placeholder='Filter…'
                  value={this.state.filterSource}
                  onChange={::this.onFilterSourceChange}
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
            onScroll={::this.onBufferScroll}
          >
            <code className='language-log'>
              {this.state.filteredEntries.map(::this.renderEntry)}
            </code>
          </pre>
        </div>
      </div>
    );
  }
}
